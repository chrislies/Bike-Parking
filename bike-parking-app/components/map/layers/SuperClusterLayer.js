"use client";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import L from "leaflet";
import useSupercluster from "use-supercluster";
import { Marker, useMap } from "react-leaflet";
import _ from "lodash";
import SpotMarker from "./SpotMarker";
import "leaflet-routing-machine";
import { transparentIcon } from "@/components/Icons";
import toast from "react-hot-toast";

const icons = {};
const fetchIcon = (count) => {
  let className, backgroundClass, adjustedSize;

  if (count < 10) {
    className = "cluster-marker-small";
    backgroundClass = "cluster-marker-background-small";
    adjustedSize = 30;
  } else if (count < 50) {
    className = "cluster-marker-medium";
    backgroundClass = "cluster-marker-background-medium";
    adjustedSize = 35;
  } else if (count < 200) {
    className = "cluster-marker-large";
    backgroundClass = "cluster-marker-background-large";
    adjustedSize = 45;
  } else {
    className = "cluster-marker-extralarge";
    backgroundClass = "cluster-marker-background-extralarge";
    adjustedSize = 50;
  }

  const iconKey = `${className}-${count}`;
  if (!icons[iconKey]) {
    icons[iconKey] = L.divIcon({
      html: `
        <div class="${backgroundClass}"></div> <!-- Background layer -->
        <div class="${className}" style="width: ${adjustedSize}px; height: ${adjustedSize}px;">
          ${count}
        </div>
      `,
      className: "leaflet-div-icon",
    });
  }

  return icons[iconKey];
};

const queryIcon = new L.Icon({
  iconUrl: "/svgs/SearchPin.svg",
  iconSize: [45, 50],
  iconAnchor: [20, 30],
  popupAnchor: [3, -16],
});

export default function SuperClusterLayer({ data }) {
  const maxZoom = 22;
  const [bounds, setBounds] = useState(null);
  const [zoom, setZoom] = useState(12);
  const [isCalculatingRoute, setIsCalculatingRoute] = useState(false);
  const [routingControl, setRoutingControl] = useState(null);
  const map = useMap();

  const handleGetDirections = (marker) => {
    if (navigator.geolocation) {
      setIsCalculatingRoute(true); // Disable the 'Directions' button
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;

          // Remove existing routing control if present
          if (routingControl) {
            routingControl.getPlan().setWaypoints([]);
            map.removeControl(routingControl);
          }

          // Create a new routing control with waypoints
          const newRoutingControl = L.Routing.control({
            waypoints: [
              L.latLng(latitude, longitude),
              L.latLng(marker.y, marker.x),
            ],
            router: L.Routing.osrmv1({
              serviceUrl:
                "https://routing.openstreetmap.de/routed-bike/route/v1",
              profile: "bike",
            }),
            lineOptions: {
              styles: [{ color: "#0f53ff", weight: 4 }],
            },
            collapsible: true,
            addWaypoints: false,
            routeWhileDragging: true,
            draggableWaypoints: true,
            createMarker: function (i, waypoint, n) {
              let icon = i === 0 ? transparentIcon : queryIcon;
              return L.marker(waypoint.latLng, {
                draggable: i === 1,
                icon: icon,
              });
            },
          }).addTo(map);

          newRoutingControl.on("routesfound", (e) => {
            setIsCalculatingRoute(false);
          });

          newRoutingControl.on("routingerror", (e) => {
            setIsCalculatingRoute(false);
            toast.error("Error calculating route.", { id: "calculationError" });
          });

          setRoutingControl(newRoutingControl);
        },
        (error) => {
          toast.error(`Error getting current location: ${error.message}`, {
            id: "locationError",
          });
          setIsCalculatingRoute(false);
        }
      );
    } else {
      toast.error("Geolocation is not supported by this browser.", {
        id: "geolocationNotSupported",
      });
      setIsCalculatingRoute(false);
    }
  };

  // get map bounds
  function updateMap() {
    const b = map.getBounds();
    setBounds([
      b.getSouthWest().lng,
      b.getSouthWest().lat,
      b.getNorthEast().lng,
      b.getNorthEast().lat,
    ]);
    setZoom(map.getZoom());
  }

  // Debounce the updateMap function
  const debouncedUpdateMap = useCallback(_.debounce(updateMap, 100), [map]);

  // Update the map bounds once when the component is mounted
  useEffect(() => {
    updateMap(); // Trigger initial update on mount
    map.on("move", debouncedUpdateMap);
    return () => {
      debouncedUpdateMap.cancel();
      map.off("move", debouncedUpdateMap);
    };
  }, [debouncedUpdateMap, map]);

  // Memoize points to avoid unnecessary recalculations
  const points = useMemo(
    () =>
      data.map((spot) => ({
        type: "Feature",
        properties: {
          cluster: false,
          spotId: spot.id,
          x: spot.x,
          y: spot.y,
          spotAddress: spot.address,
          spotType: spot.type, // 'rack' or 'sign'
          rackType: spot.rack_type,
          signDescription: spot.sign_description,
          date_inst: spot.date_inst,
          author: spot.author,
          date_added: spot.date_added,
        },
        geometry: {
          type: "Point",
          coordinates: [parseFloat(spot.x), parseFloat(spot.y)],
        },
      })),
    [data]
  );

  // Use supercluster hook to get clusters
  const { clusters, supercluster } = useSupercluster({
    points,
    bounds,
    zoom,
    options: { radius: 150, maxZoom: 17 },
  });

  return (
    <>
      {clusters.map((cluster) => {
        const [longitude, latitude] = cluster.geometry.coordinates;
        const { cluster: isCluster, point_count: pointCount } =
          cluster.properties;

        // Render cluster markers
        if (isCluster) {
          const size = Math.min(
            50,
            Math.max(10, 10 + Math.sqrt(pointCount) * 10)
          ); // Calculate size based on point count

          return (
            <Marker
              key={`cluster-${cluster.id}`}
              position={[latitude, longitude]}
              icon={fetchIcon(pointCount)}
              eventHandlers={{
                click: () => {
                  const expansionZoom = Math.min(
                    supercluster.getClusterExpansionZoom(cluster.id),
                    maxZoom
                  );
                  map.setView([latitude, longitude], expansionZoom, {
                    animate: true,
                  });
                },
              }}
            />
          );
        }

        return (
          <SpotMarker
            key={`spot-${cluster.properties.spotId}`}
            cluster={cluster}
            map={map}
            handleGetDirections={handleGetDirections}
            isCalculatingRoute={isCalculatingRoute}
          />
        );
      })}
    </>
  );
}

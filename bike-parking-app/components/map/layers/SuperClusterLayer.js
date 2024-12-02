"use client";
import React, { useEffect, useMemo, useState } from "react";
import L from "leaflet";
import useSupercluster from "use-supercluster";
import { Marker, useMap } from "react-leaflet";
import _ from "lodash";
import SpotMarker from "./SpotMarker";
import { useMarkerStore } from "@/app/stores/markerStore";

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
export default function SuperClusterLayer({ data, showRacks, showShelters, showSigns }) {
  const maxZoom = 22;
  const map = useMap();
  const [bounds, setBounds] = useState(null);
  const [zoom, setZoom] = useState(map.getZoom());
  const { isCalculatingRoute } = useMarkerStore();

  // Memoize points
  const points = useMemo(
    () =>
      data
        ?.filter(
          (spot) =>
            (spot.type === "rack" && showRacks) ||
            (spot.type === "shelter" && showShelters) ||
            (spot.type === "sign" && showSigns)
        )
        .map((spot) => ({
          type: "Feature",
          properties: {
            cluster: false,
            spotId: spot.id,
            x: spot.x,
            y: spot.y,
            spotAddress: spot.address,
            spotType: spot.type,
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
        })) || [],
    [data, showRacks, showShelters, showSigns]
  );

  // Update bounds and zoom on map movement
  useEffect(() => {
    const updateBoundsZoom = () => {
      const b = map.getBounds();
      setBounds([
        b.getSouthWest().lng,
        b.getSouthWest().lat,
        b.getNorthEast().lng,
        b.getNorthEast().lat,
      ]);
      setZoom(map.getZoom());
    };

    const debouncedUpdate = _.debounce(updateBoundsZoom, 100);
    updateBoundsZoom(); // Initial update

    map.on("moveend", debouncedUpdate);
    map.on("zoomend", debouncedUpdate);

    return () => {
      map.off("moveend", debouncedUpdate);
      map.off("zoomend", debouncedUpdate);
      debouncedUpdate.cancel();
    };
  }, [map]);

  // Get clusters
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
        const { cluster: isCluster, point_count: pointCount } = cluster.properties;

        if (isCluster) {
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
            isCalculatingRoute={isCalculatingRoute}
          />
        );
      })}
    </>
  );
}

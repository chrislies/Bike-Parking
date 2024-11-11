import React, { useCallback, useEffect, useMemo, useState } from "react";
import L from "leaflet";
import useSupercluster from "use-supercluster";
import { Marker, useMap } from "react-leaflet";
import _ from "lodash";

const icons = {};
const fetchIcon = (count, size) => {
  if (!icons[count]) {
    icons[count] = L.divIcon({
      html: `<div class="cluster-marker" style="width: ${size}px; height: ${size}px;">${count}</div>`,
    });
  }
  return icons[count];
};

const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconSize: [25, 25],
});

export default function ShowSpots({ data }) {
  const maxZoom = 22;
  const [bounds, setBounds] = useState(null);
  const [zoom, setZoom] = useState(12);
  const map = useMap();

  // get map bounds
  function updateMap() {
    const b = map.getBounds();
    console.log("Bounds: ", b);
    setBounds([
      b.getSouthWest().lng,
      b.getSouthWest().lat,
      b.getNorthEast().lng,
      b.getNorthEast().lat,
    ]);
    setZoom(map.getZoom());
  }

  const debouncedUpdateMap = useMemo(
    () => _.debounce(updateMap, 100),
    [updateMap]
  );

  useEffect(() => {
    debouncedUpdateMap();
    return () => {
      debouncedUpdateMap.cancel();
    };
  }, [debouncedUpdateMap]);

  useEffect(() => {
    map.on("move", debouncedUpdateMap);
    return () => {
      map.off("move", debouncedUpdateMap);
    };
  }, [map, debouncedUpdateMap]);

  // Optimize the points processing (convert once instead of on every render)
  const points = useMemo(
    () =>
      data.map((spot) => ({
        type: "Feature",
        properties: { cluster: false, spotId: spot.id },
        geometry: {
          type: "Point",
          coordinates: [parseFloat(spot.x), parseFloat(spot.y)],
        },
      })),
    [data]
  );

  const { clusters, supercluster } = useSupercluster({
    points: points,
    bounds: bounds,
    zoom: zoom,
    options: { radius: 100, maxZoom: 17 },
  });

  console.log(clusters.length, zoom);

  return (
    <>
      {clusters.map((cluster) => {
        // every cluster point has coordinates
        const [longitude, latitude] = cluster.geometry.coordinates;
        // the point may be either a cluster or a spot point
        const { cluster: isCluster, point_count: pointCount } =
          cluster.properties;

        // we have a cluster to render
        if (isCluster) {
          return (
            <Marker
              key={`cluster-${cluster.id}`}
              position={[latitude, longitude]}
              icon={fetchIcon(
                pointCount,
                10 + (pointCount / points.length) * 40
              )}
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

        // we have a single point (spot) to render
        return (
          <Marker
            key={`spot-${cluster.properties.spotId}`}
            position={[latitude, longitude]}
            icon={markerIcon}
          />
        );
      })}
    </>
  );
}

import React, { useEffect, useState } from "react";
import { LayerGroup, LayersControl } from "react-leaflet";
import PixiOverlay from "react-leaflet-pixi-overlay";
import Supercluster from "supercluster";

const getRandomNumber = (min, max) => Math.random() * (max - min) + min;

const PixiLayer = () => {
  const [markers, setMarkers] = useState([]);
  const [clusteredMarkers, setClusteredMarkers] = useState([]);

  useEffect(() => {
    const generateRandomMarkers = () => {
      const pixiMarkers = [];
      for (let i = 1; i <= 20000; i++) {
        const latitude = getRandomNumber(-90, 90);
        const longitude = getRandomNumber(-180, 180);
        const marker = {
          id: i,
          position: [latitude, longitude],
          iconColor: "blue",
          popup: `popup text ${i}`,
          popupOpen: false,
          onClick: () => {},
          tooltip: `tooltip text ${i}`,
        };
        pixiMarkers.push(marker);
      }
      return pixiMarkers;
    };

    setMarkers(generateRandomMarkers());
  }, []);

  useEffect(() => {
    if (markers.length > 0) {
      const index = new Supercluster({
        radius: 60,
        maxZoom: 16,
      });

      index.load(markers);

      const bounds = {
        minLng: -180,
        minLat: -90,
        maxLng: 180,
        maxLat: 90,
      };

      const zoom = 3;
      const clustered = index.getClusters(
        [bounds.minLng, bounds.minLat, bounds.maxLng, bounds.maxLat],
        zoom
      );

      setClusteredMarkers(clustered);
    }
  }, [markers]);

  return (
    <LayersControl.Overlay name="Pixi Overlay" checked>
      <LayerGroup>
        <PixiOverlay markers={clusteredMarkers} />
      </LayerGroup>
    </LayersControl.Overlay>
  );
};

export default PixiLayer;

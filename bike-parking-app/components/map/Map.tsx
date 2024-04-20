"use client";

import { MapContainer, TileLayer, LayersControl } from "react-leaflet";
import MarkerLayer from "./layers/MarkerLayer";
import MarkerLayer2 from "./layers/MyMarkerLayer";

const RootMap = () => {
  return (
    <MapContainer
      center={[40.71151957593488, -73.88017135962203]}
      zoom={11}
      minZoom={3}
      scrollWheelZoom={true}
      style={{
        height: "100vh",
        width: "100vw",
      }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <LayersControl position="topright">
        <MarkerLayer />
        <MarkerLayer2 />
      </LayersControl>
    </MapContainer>
  );
};

export default RootMap;

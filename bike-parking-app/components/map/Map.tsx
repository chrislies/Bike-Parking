"use client";
import { MapContainer, TileLayer, LayersControl } from "react-leaflet";
import { Toaster } from "react-hot-toast";
import LocateUser from "./LocateUser";
import MarkerLayer from "./layers/MarkerLayer";
import ControlGeocoder from "../LeafletControlGeocoder";
import { useState } from "react";

const { BaseLayer } = LayersControl;

const RootMap = () => {
  const [filter, setFilter] = useState("rack");

  return (
    <>
      <Toaster />
      <MapContainer
        center={[40.71151957593488, -73.88017135962203]}
        zoom={11}
        minZoom={3}
        scrollWheelZoom={true}
        style={{
          height: "100vh",
          width: "100vw",
        }}
        rotate={true}
        touchRotate={true}
        rotateControl={{
          closeOnZeroBearing: false,
        }}
      >
        <LayersControl position="topright">
          <BaseLayer checked name="Street Layer">
            <TileLayer
              maxZoom={24}
              maxNativeZoom={19}
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              // url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            />
          </BaseLayer>
          <BaseLayer name="Street Layer">
            <TileLayer
              maxZoom={24}
              maxNativeZoom={20}
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            />
          </BaseLayer>
          <MarkerLayer />
        </LayersControl>
        <LocateUser />
        <ControlGeocoder />
      </MapContainer>
    </>
  );
};

export default RootMap;

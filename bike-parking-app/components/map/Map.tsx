"use client";
import { MapContainer, TileLayer, LayersControl } from "react-leaflet";
import MarkerLayer from "./layers/MarkerLayer";
import "leaflet-rotate";
import ControlGeocoder from "../LeafletControlGeocoder";
import Navbar from "../navbar/Navbar";
import UserLocationMarker from "./UserLocationMarker";
import PixiLayer from "./layers/PixiLayer";

const { BaseLayer } = LayersControl;

const RootMap = () => {
  return (
    <>
      <MapContainer
        center={[40.71151957593488, -73.88017135962203]}
        zoom={11}
        minZoom={3}
        scrollWheelZoom={true}
        className="absolute h-svh w-full"
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
          <BaseLayer name="Satellite Layer">
            <TileLayer
              maxZoom={24}
              maxNativeZoom={20}
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            />
          </BaseLayer>
          <MarkerLayer />
          {/* <PixiLayer /> */}
        </LayersControl>
        <UserLocationMarker />
        <ControlGeocoder />
        <Navbar />
      </MapContainer>
    </>
  );
};

export default RootMap;

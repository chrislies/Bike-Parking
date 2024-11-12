"use client";
import { useQuery } from "react-query";
import { MapContainer, TileLayer, LayersControl } from "react-leaflet";
import getCoordinates from "@/lib/getCoordinates";
import ShowSpots from "./layers/SuperClusterLayer";
import Loader from "../Loader";
import "leaflet-rotate";
import ControlGeocoder from "./LeafletControlGeocoder";
import Toolbar from "../toolbar/Toolbar";
import UserLocationMarker from "./UserLocationMarker";

const { BaseLayer } = LayersControl;

export default function SuperClusterMap() {
  const { isLoading, error, data } = useQuery("repoData", getCoordinates, {
    staleTime: 5 * 60 * 1000, // Keep the data fresh for 5 minutes
    cacheTime: 10 * 60 * 1000, // Cache the data for 10 minutes
    refetchOnWindowFocus: false, // Prevent refetch on window/tab focus
  });

  if (isLoading) return <Loader />;

  if (error) return <div>An error has occurred: {error.message}</div>;

  return (
    <MapContainer
      center={[40.71151957593488, -73.88017135962203]}
      zoom={11}
      minZoom={3}
      scrollWheelZoom={true}
      className="absolute h-svh w-full"
      rotate={true}
      touchRotate={true}
      attributionControl={false}
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
        <ShowSpots data={data} />
      </LayersControl>
      <UserLocationMarker />
      <ControlGeocoder />
      <Toolbar />
    </MapContainer>
  );
}

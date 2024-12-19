"use client";
import { useQuery } from "react-query";
import { MapContainer, LayersControl } from "react-leaflet";
import getCoordinates from "@/lib/getCoordinates";
import SuperClusterLayer from "./layers/SuperClusterLayer";
import Loader from "../Loader";
import "leaflet-rotate";
import ControlGeocoder from "./LeafletControlGeocoder";
import Toolbar from "../toolbar/Toolbar";
import UserLocationMarker from "./UserLocationMarker";
import { useState } from "react";
import ToggleLayerControl from "./ToggleLayerControl";

export default function SuperClusterMap() {
  const [showRacks, setShowRacks] = useState(true);
  const [showSigns, setShowSigns] = useState(true);
  const [showShelters, setShowShelters] = useState(true);
  const [showStreetLayer, setShowStreetLayer] = useState(true);
  const [showSatelliteLayer, setShowSatelliteLayer] = useState(false);

  const { isLoading, error, data } = useQuery("coordinates", getCoordinates, {
    staleTime: 5 * 60 * 1000, // Keep the data fresh for 5 minutes
    cacheTime: 10 * 60 * 1000, // Cache the data for 10 minutes
    refetchOnWindowFocus: false, // Prevent refetch on window/tab focus
  });

  if (error) return <div>An error has occurred: {error.message}</div>;

  const handleToggleRacks = () => setShowRacks((prev) => !prev);
  const handleToggleShelters = () => setShowShelters((prev) => !prev);
  const handleToggleSigns = () => setShowSigns((prev) => !prev);
  const handleToggleStreetLayer = () => setShowStreetLayer((prev) => !prev);
  const handleToggleSatelliteLayer = () => setShowSatelliteLayer((prev) => !prev);

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
      {!isLoading && data && (
        <SuperClusterLayer
          data={data}
          showRacks={showRacks}
          showShelters={showShelters}
          showSigns={showSigns}
        />
      )}
      {isLoading && <Loader />}
      <UserLocationMarker />
      <ControlGeocoder />
      <Toolbar />
      <ToggleLayerControl
        showRacks={showRacks}
        showShelters={showShelters}
        showSigns={showSigns}
        handleToggleRacks={handleToggleRacks}
        handleToggleShelters={handleToggleShelters}
        handleToggleSigns={handleToggleSigns}
        showStreetLayer={showStreetLayer}
        showSatelliteLayer={showSatelliteLayer}
        handleToggleStreetLayer={handleToggleStreetLayer}
        handleToggleSatelliteLayer={handleToggleSatelliteLayer}
      />
    </MapContainer>
  );
}

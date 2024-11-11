"use client";

import { useQuery } from "react-query";
import { MapContainer, TileLayer } from "react-leaflet";
import getCoordinates from "@/lib/getCoordinates";
import ShowSpots from "./layers/SuperClusterLayer";
import Loader from "../Loader";

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
      zoom={13}
      style={{ height: "100vh", width: "100vw" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      />
      <ShowSpots data={data} />
    </MapContainer>
  );
}

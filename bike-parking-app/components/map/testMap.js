"use client";
import { useEffect, useState } from "react";
import L from "leaflet";
import getCoordinates from "@/lib/getCoordinates";
import { PruneCluster, PruneClusterForLeaflet } from "prunecluster-exportable";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css"; // Re-uses images from ~leaflet package
import "leaflet-defaulticon-compatibility";
import Loader from "../Loader";

const LeafletMap = () => {
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const initializeMap = async () => {
      // Initialize the map
      const mymap = L.map("map").setView(
        [40.71151957593488, -73.88017135962203],
        13
      );

      // Add the base map layer
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mymap);

      try {
        // Fetch coordinates data
        setLoading(true);

        const pruneCluster = new PruneClusterForLeaflet(160, 160);

        const coordinatesData = await getCoordinates();

        if (coordinatesData) {
          // Add markers to the PruneCluster instance
          coordinatesData.forEach((coordinate) => {
            const marker = new PruneCluster.Marker(coordinate.y, coordinate.x);
            pruneCluster.RegisterMarker(marker);
            marker.data.popup = `
            <b>Address:</b> ${coordinate.address}<br/>
            <b>Rack Type:</b> ${coordinate.rack_type}<br/>
            <b>Date Installed:</b> ${coordinate.date_inst}<br/>
            <b>Sign Description:</b> ${coordinate.sign_description}<br/>
            <b>LatLng:</b> ${coordinate.y}, ${coordinate.x}
            `;
          });

          // Add the PruneCluster instance to the map
          mymap.addLayer(pruneCluster);
        }
      } catch (error) {
        console.error("Failed to fetch coordinates data:", error);
      }
      setLoading(false);
    };
    initializeMap();
  }, []);

  return (
    <>
      {loading && <Loader />}
      <div id="map" style={{ height: "100svh", width: "100vw" }}></div>
    </>
  );
};

export default LeafletMap;

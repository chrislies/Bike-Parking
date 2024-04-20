"use client";

import getCoordinates from "@/lib/getCoordinates";
import { useEffect, useState } from "react";
import { LayerGroup, LayersControl, Marker } from "react-leaflet";
import MyMarker from "../MyMarker";
import MarkerClusterGroup from "react-leaflet-cluster";
import Loader from "@/components/Loader";
import { rackIcon } from "@/components/Icons";

interface MarkerData {
  x?: number;
  y?: number;
  id?: string;
  address?: string;
  rack_type?: string;
  date_inst?: string;
  sign_description?: string;
  sign_code?: string;
  favorite: boolean;
  type: string;
}

const MarkerLayer2 = () => {
  const [markers, setMarkers] = useState<MarkerData[] | null>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);

  const chunkProgressHandler = (
    processedMarkers: number,
    totalMarkers: number,
    elapsedTime: number
  ) => {
    const percentage = Math.round((processedMarkers / totalMarkers) * 100);
    setProgress(percentage);
    console.log(percentage);
  };
  const [markerss, setMarkerss] = useState<any[]>([]);

  useEffect(() => {
    setLoading(true);
    const fetchData = () => {
      let markerss = [];
      for (let i = 0; i < 50000; i++) {
        markerss.push({
          position: {
            lng: -122.673447 + Math.random() * 200.0,
            lat: 45.5225581 - 60 + Math.random() * 80,
          },
        });
      }
      setMarkerss(markerss);
      setLoading(false);
    };
    fetchData();
  }, []);

  return (
    <>
      {loading && <Loader />}
      <p className="z-[999] text-center">Progress: {progress}%</p>
      {markerss && (
        <>
          <LayersControl.Overlay name="Marker" checked>
            <LayerGroup>
              <MarkerClusterGroup
                chunkedLoading={true}
                maxClusterRadius={160}
                removeOutsideVisibleBounds={true}
                chunkProgress={chunkProgressHandler}
              >
                {markerss.map((marker, index) => (
                  <Marker
                    key={index}
                    position={[marker.position.lat, marker.position.lng]}
                    icon={rackIcon}
                  ></Marker>
                ))}
              </MarkerClusterGroup>
            </LayerGroup>
          </LayersControl.Overlay>
        </>
      )}
    </>
  );
};

export default MarkerLayer2;

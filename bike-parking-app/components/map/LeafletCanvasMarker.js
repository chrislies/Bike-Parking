import { useEffect, useState, useRef } from "react";
import { useMap } from "react-leaflet";
import "leaflet-canvas-marker";
import L from "leaflet";
import getCoordinates from "@/lib/getCoordinates";

export default function LeafletCanvasMarker() {
  const [loading, setLoading] = useState(false);
  const map = useMap();
  const leafletMarkersRef = useRef([]);

  useEffect(() => {
    if (!map) return;

    const ciLayer = L.canvasIconLayer({}).addTo(map);

    const icon = L.icon({
      iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
      iconSize: [20, 18],
      iconAnchor: [10, 9],
    });

    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getCoordinates();
        console.log(data);
        leafletMarkersRef.current = data.map((marker, i) =>
          L.marker([marker.y, marker.x], { icon }).bindPopup(`I Am ${i}`)
        );
        ciLayer.addLayers(leafletMarkersRef.current);
      } catch (error) {
        console.error(error);
      }
      setLoading(false);
    };

    if (typeof window !== "undefined") {
      fetchData();
    }
  }, [map]);

  return null;
}

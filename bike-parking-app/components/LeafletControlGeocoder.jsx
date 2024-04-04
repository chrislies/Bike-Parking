"use client";
import { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";
import "leaflet-control-geocoder/dist/Control.Geocoder.css";
import "leaflet-control-geocoder/dist/Control.Geocoder.js";
import L from "leaflet";

import { queryIcon } from "./Icons";

export default function ControlGeocoder() {
  const map = useMap();
  const markerRef = useRef(null);

  useEffect(() => {
    const initializeGeocoder = () => {
      let geocoder = L.Control.Geocoder.nominatim();

      // Check if location object is available
      if (
        typeof window !== "undefined" &&
        window.location &&
        window.location.search
      ) {
        // parse /?geocoder=nominatim from URL
        const params = new URLSearchParams(window.location.search);
        const geocoderString = params.get("geocoder");
        if (geocoderString && L.Control.Geocoder[geocoderString]) {
          geocoder = L.Control.Geocoder[geocoderString]();
        } else if (geocoderString) {
          console.warn("Unsupported geocoder", geocoderString);
        }
      }

      L.Control.geocoder({
        query: "",
        placeholder: "Search here...",
        defaultMarkGeocode: false,
        geocoder,
        position: "topleft",
      })
        .on("markgeocode", function (e) {
          const latlng = e.geocode.center;
          // Remove previous marker if it exists
          if (markerRef.current) {
            map.removeLayer(markerRef.current);
          }
          // Add new marker
          markerRef.current = L.marker(latlng, { icon: queryIcon })
            .addTo(map)
            .bindPopup(e.geocode.name)
            .openPopup();
          map.fitBounds(e.geocode.bbox, { animate: true, duration: 1 });
        })
        .addTo(map);
    };

    initializeGeocoder();
  }, [map]);

  return null;
}

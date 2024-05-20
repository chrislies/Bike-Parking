import { LatLng, latLng } from "leaflet";
import { useEffect, useState } from "react";
import { Circle, Marker, Popup, useMap, useMapEvents } from "react-leaflet";
import { userIcon } from "../Icons";
import toast from "react-hot-toast";
import { Locate } from "../svgs";


type GeolocationPosition = {
  lat: number;
  lng: number;
};

function UserLocationMarker() {
  const [position, setPosition] = useState<GeolocationPosition | null>(null);
  const map = useMap();

  useMapEvents({
    locationfound: (e) => {
      setPosition({ lat: e.latlng.lat, lng: e.latlng.lng });
      map.flyTo(e.latlng, 19, { duration: 1 });
    },
    locationerror: (err) => {
      console.error("Error accessing user location:", err.message);
    },
  });

  useEffect(() => {
    map.locate();
  }, [map]);

  return (
    <>
      {position && (
        <Marker position={position} icon={userIcon}>
          <Popup>You are here.</Popup>
        </Marker>
      )}
    </>
  );
}

export default UserLocationMarker;

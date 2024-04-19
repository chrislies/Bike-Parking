import { LatLngExpression } from "leaflet";
import React, { useCallback, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { UserMarker } from "../svgs";
import { useMapEvents } from "react-leaflet";

export const LocateButton = () => {
  const map = useMapEvents({});
  const [userPosition, setUserPosition] = useState<LatLngExpression | undefined>(undefined); // prettier-ignore

  const handleClick = useCallback(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        setUserPosition([position.coords.latitude, position.coords.longitude]);
      });
    } else {
      toast.error("Location permission denied!");
      setUserPosition(undefined);
    }
  }, []);

  useEffect(() => {
    if (userPosition) {
      map?.flyTo(userPosition);
    }
  }, [map, userPosition]);

  return (
    <>
      <Toaster />
      <button
        type="button"
        style={{ zIndex: 400 }}
        className="button z-999 absolute top-16 right-3 rounded bg-white p-2 text-dark shadow-md"
        onClick={() => handleClick()}
      >
        me
      </button>
      {userPosition && <UserMarker />}
    </>
  );
};

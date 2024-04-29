"use client";
import { useMapEvents, Marker, Popup, Circle } from "react-leaflet";
import toast from "react-hot-toast";
import { useState } from "react";
import { userIcon } from "../Icons";
import { Locate } from "../svgs";

function LocateUser() {
  const [position, setPosition] = useState<L.LatLngExpression | null>(null);
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [buttonDisabled, setButtonDisabled] = useState(false);

  const map = useMapEvents({
    locationfound: (e) => {
      setPosition(e.latlng);
      setAccuracy(e.accuracy);
      map.flyTo(e.latlng, 19, { duration: 1 });
    },
    locationerror: (err) => {
      toast.error(
        <div className="flex flex-col">
          <h1 className="font-bold underline">
            {`Error accessing user location: `}
          </h1>
          {err.message}
        </div>,
        {
          id: `location-error`,
        }
      );
    },
  });

  const handleLocateClick = () => {
    setButtonDisabled(true);
    setTimeout(() => {
      setButtonDisabled(false);
    }, 1000);
    map.locate();
  };

  return (
    <>
      <button
        onClick={handleLocateClick}
        className="z-[999] select-none cursor-pointer absolute top-[170px] left-[9px] w-[36px] h-[36px] p-0 bg-white hover:bg-gray-100 text-black rounded-md border-2 border-[rgba(0,0,0,0.2)] shadow-md"
        title="Find my location"
        aria-label="Find my location"
        aria-disabled="false"
        disabled={buttonDisabled}
      >
        <span className="absolute top-[-16px] left-[-16px] scale-[.4]">
          <Locate />
        </span>
      </button>

      {position !== null && (
        <>
          <Marker position={position} icon={userIcon}>
            <Popup>You are in this area.</Popup>
          </Marker>
          {accuracy !== null && (
            <Circle
              center={position}
              radius={accuracy}
              // pathOptions={{ color: "blue", fillColor: "blue" }}
            />
          )}
        </>
      )}
    </>
  );
}

export default LocateUser;

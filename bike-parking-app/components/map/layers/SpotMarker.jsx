import React from "react";
import { Marker, Popup, Tooltip } from "react-leaflet";
import L from "leaflet";
import ReportComponent from "../ReportComponent";
import BusyComponent from "../BusyComponent";
import Image from "next/image";
import { Bookmark, Directions, NoImage } from "@/components/svgs";
import { getImageSource } from "@/lib/getImageSource";
import Link from "next/link";
import { formatDate } from "@/lib/formatDate";

const markerIcon = new L.Icon({
  iconUrl: "/svgs/Marker.svg",
  iconSize: [45, 50],
  iconAnchor: [20, 30],
  popupAnchor: [3, -16],
});

export default function SpotMarker({ cluster, map }) {
  const {
    spotId,
    spotType,
    x,
    y,
    spotAddress,
    rackType,
    signDescription,
    date_inst,
    author,
    date_added,
  } = cluster.properties;
  const [longitude, latitude] = cluster.geometry.coordinates;

  const handleMarkerClick = () => {
    const currentZoom = map.getZoom() > 19 ? map.getZoom() : 20;
    map.setView([latitude, longitude], currentZoom, {
      animate: true,
    });
  };

  return (
    <Marker
      key={`spot-${spotId}`}
      position={[latitude, longitude]}
      icon={markerIcon}
      eventHandlers={{ click: handleMarkerClick }}
    >
      <Tooltip>
        {spotType === "userAdded" ? "User Added" : rackType || "Street Sign"}
      </Tooltip>
      <Popup minWidth={170} autoPan={false}>
        <div className="flex flex-col">
          <div className="flex flex-col font-bold">
            <div className="flex items-center">
              <p className="!m-0 !p-0 text-base font-extrabold font-sans">
                {rackType || "Street Sign"}
              </p>
            </div>
            {spotId && (
              <ReportComponent
                siteId={spotId}
                x={x}
                y={y}
                rack_type={rackType}
                address={spotAddress}
              />
            )}
            <BusyComponent x={x} y={y} />
          </div>
          <div className="relative my-1 flex justify-center items-center select-none pointer-events-none">
            {rackType && getImageSource(rackType) ? (
              <Image
                className="rounded-md shadow"
                src={getImageSource(rackType)}
                alt={rackType}
                height={700}
                width={700}
              />
            ) : spotType === "sign" ? (
              <>
                <Image
                  className="rounded-md shadow"
                  src="/images/streetsign.jpg"
                  alt="Street Sign"
                  height={700}
                  width={700}
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/85 rounded-md opacity-0 hover:opacity-100 duration-500 ease-in-out transition-opacity overflow-auto select-text pointer-events-auto">
                  <p className="text-xs text-white font-mono px-2">
                    {signDescription}
                  </p>
                </div>
              </>
            ) : (
              <div className="flex flex-col w-full items-center bg-slate-200 border-[1px] border-slate-300 rounded-lg p-3">
                <NoImage />
                <p className="!p-0 !m-0 text-xs">No image available</p>
              </div>
            )}
          </div>
          <Link
            className={`text-center ${
              spotType === "rack"
                ? "text-base overflow-x-auto"
                : "max-w-[170px] text-sm tracking-tight"
            } hover:underline !p-0 !m-0 !text-black`}
            href={`https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${y},${x}`}
            target="_blank"
            rel="noopener noreferrer"
            title="View in Google Maps"
            aria-label="View in Google Maps"
          >
            {spotAddress}
          </Link>
          <div className="flex flex-col gap-2 mt-1 mb-3">
            <button
              onClick={() => {}}
              title="Save Location"
              aria-label="Save Location"
              className="flex text-sm font-bold justify-center items-center w-full border-[1px] rounded-3xl border-slate-300 bg-slate-200 hover:bg-slate-300"
            >
              <Bookmark className="h-7 w-7 hover:cursor-pointer fill-transparent" />
              Save
            </button>
            <button
              onClick={() => {}}
              title="Directions"
              aria-label="Directions"
              className="flex text-sm font-bold justify-center items-center w-full border-[1px] rounded-3xl border-blue-600 hover:shadow-lg gap-1 text-white bg-blue-600"
            >
              <Directions className="h-7 w-7 hover:cursor-pointer items-end" />
              Directions
            </button>
          </div>
          {spotType === "rack" ? (
            <div className="flex justify-between items-end">
              <p className="italic text-xs !m-0 !p-0">
                {`Date Installed: `}
                {date_inst && new Date(date_inst).getFullYear() === 1900
                  ? "N/A"
                  : formatDate(date_inst)}
              </p>
            </div>
          ) : spotType === "userAdded" ? (
            <div className="flex justify-between items-end">
              <p className="text-xs !m-0 !p-0">
                {`Added by: ${author}, ${date_added}`}
              </p>
            </div>
          ) : null}
        </div>
      </Popup>
    </Marker>
  );
}

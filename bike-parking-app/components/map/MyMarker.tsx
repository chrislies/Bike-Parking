import { getImageSource } from "@/lib/getImageSource";
import Image from "next/image";
import { FC, useCallback, useRef } from "react";
import { Marker, Popup, useMapEvents } from "react-leaflet";
import { Bookmark, Directions, NoImage } from "../svgs";
import { formatDate } from "@/lib/formatDate";
import { favoriteIcon, queryIcon, rackIcon, signIcon } from "../Icons";

interface MyMarkerProps {
  marker: MarkerData;
  isFavoriteMarker: (marker: MarkerData) => boolean;
  handleSaveFavorite: (marker: MarkerData) => void;
}

const MyMarker: FC<MyMarkerProps> = ({
  marker,
  isFavoriteMarker,
  handleSaveFavorite,
}) => {
  const imageSize = 700;
  console.log(`rendering marker`);

  const map = useMapEvents({});
  const markerRef = useRef<any>(null);

  const handleFlyTo = useCallback(() => {
    const currentZoom = map.getZoom() > 19 ? map.getZoom() : 20;
    map.flyTo([marker.y!, marker.x!], currentZoom, {
      animate: true,
      duration: 1.5,
    });
  }, [map]);

  const handleColorChange = useCallback(() => {
    // Change marker icon to queryIcon
    if (markerRef.current) {
      markerRef.current.setIcon(queryIcon);
    }
  }, []);

  const memoizedHandleSaveFavorite = useCallback(
    () => {
      handleSaveFavorite(marker);
    },
    [handleSaveFavorite, marker] // Add handleSaveFavorite and marker to the dependency array
  );

  return (
    <Marker
      key={marker.id}
      ref={markerRef}
      // prettier-ignore
      icon={isFavoriteMarker(marker) ? favoriteIcon : marker.type === "rack" ? rackIcon : signIcon}
      position={[marker.y!, marker.x!]}
      eventHandlers={{
        click: () => {
          handleFlyTo();
          handleColorChange();
        },
      }}
    >
      <Popup minWidth={170}>
        {/* <Popup minWidth={200}> */}
        <div className="popup-rack flex flex-col">
          <div className="flex flex-col font-bold">
            <p className="side_id !m-0 !p-0 text-base">{marker.id}</p>
            <p className="rack_type !m-0 !p-0 text-base">{marker.rack_type}</p>
            {/* TODO: Add # of reports here */}
            {/* {marker.site_id && <ReportComponent siteId={marker.site_id} x={marker.x} y={marker.y} />} */}
            {/* <DeleteComponent x={marker.x} y={marker.y} site_id={marker.site_id} /> */}
            {/* <BusyComponent x={marker.x!} y={marker.y!} /> */}
          </div>
          <div className="my-1 flex justify-center items-center select-none pointer-events-none">
            {marker.rack_type && getImageSource(marker.rack_type) ? (
              <Image
                className="rounded-md shadow"
                src={getImageSource(marker.rack_type)}
                alt={marker.rack_type}
                height={imageSize}
                width={imageSize}
              />
            ) : marker.type === "sign" ? (
              <Image
                className="rounded-md shadow"
                src={"/images/streetsign.jpg"}
                alt={"street sign"}
                height={imageSize}
                width={imageSize}
              />
            ) : (
              <div className="flex flex-col w-full items-center bg-slate-200 border-[1px] border-slate-300 rounded-lg p-3">
                <NoImage />
                <p className="!p-0 !m-0 text-xs">No image available</p>
              </div>
            )}
          </div>
          {/* prettier-ignore */}
          <p className={`ifo_address text-center ${marker.type === 'rack' ? 'text-base overflow-x-auto' : 'max-w-[170px] text-sm tracking-tight'} !p-0 !m-0`}>
            {marker.address}
          </p>
          <div className="flex flex-col gap-2 mt-1 mb-3">
            <button
              onClick={memoizedHandleSaveFavorite}
              title="Save Location"
              aria-label="Save Location"
              aria-disabled="false"
              className="flex text-sm font-bold justify-center items-center w-full border-[1px] rounded-3xl border-slate-300 bg-slate-200 hover:bg-slate-300"
            >
              <Bookmark
                className={`h-7 w-7 hover:cursor-pointer ${
                  isFavoriteMarker(marker)
                    ? "fill-yellow-300"
                    : "fill-transparent"
                }`}
              />
              Save
            </button>
            <button
              onClick={() => {}}
              title="Directions"
              aria-label="Directions"
              aria-disabled="false"
              className="flex text-sm font-bold justify-center items-center w-full border-[1px] rounded-3xl border-blue-600 hover:shadow-lg gap-1 text-white bg-blue-600"
            >
              <Directions
                className={`h-7 w-7 hover:cursor-pointer items-end`}
              />
              Directions
            </button>

            {/* Delete Button */}
            {/* <button
              onClick={() => handleDeleteRequest(marker)}
              title="Delete"
              aria-label="Delete"
              aria-disabled="false"
              className="flex text-sm font-bold justify-center items-center w-full border-[1px] rounded-3xl border-blue-600 hover:shadow-lg gap-1 text-white bg-blue-600"
            >
              <Directions
                className={`h-7 w-7 hover:cursor-pointer items-end`}
              />
              DeleteRequest
            </button> */}
          </div>
          {marker.type === "rack" ? (
            <div className="flex justify-between items-end">
              <p className="date_installed italic text-xs !m-0 !p-0">
                {`Date Installed: `}
                {marker.date_inst &&
                new Date(marker.date_inst).getFullYear() === 1900
                  ? "N/A"
                  : formatDate(marker.date_inst!)}
              </p>
            </div>
          ) : null}
        </div>
      </Popup>
    </Marker>
  );
};

export default MyMarker;

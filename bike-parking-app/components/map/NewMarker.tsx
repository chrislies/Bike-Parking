import { getImageSource } from "@/lib/getImageSource";
import Image from "next/image";
import L from "leaflet";
import { FC, useCallback, useRef, useState } from "react";
import { Marker, Popup, useMapEvents } from "react-leaflet";
import { Bookmark, Directions, NoImage } from "../svgs";
import { formatDate } from "@/lib/formatDate";
import { favoriteIcon, queryIcon, rackIcon, signIcon } from "../Icons";
import toast from "react-hot-toast";
import { useParams } from "next/navigation";
import queryString from "query-string";
import axios from "axios";
import { createControlComponent } from "@react-leaflet/core";
import { Geocoder, geocoders } from "leaflet-control-geocoder";
import "leaflet-routing-machine";

interface NewMarkerProps {
  marker: MarkerData;
  favoriteLocations: string[];
  supabase: any;
  session: any;
  username: any;
  uuid: any;
}

const NewMarker: FC<NewMarkerProps> = ({
  marker,
  favoriteLocations,
  supabase,
  session,
  username,
  uuid,
}) => {
  const params = useParams();

  console.log(`rendering marker`);
  const imageSize = 700;
  const [isBookmarked, setIsBookmarked] = useState(
    favoriteLocations.includes(marker.id!)
  );
  const map = useMapEvents({});
  const markerRef = useRef<any>(null);

  const handleFlyTo = useCallback(() => {
    const currentZoom = map.getZoom() > 19 ? map.getZoom() : 20;
    map.flyTo([marker.y!, marker.x!], currentZoom, {
      animate: true,
      duration: 1.5,
    });
  }, [map]);

  const handleSaveLocation = useCallback(async () => {
    if (!uuid) {
      toast.error("Sign in to save locations!", {
        id: "signInToSaveLocationsError",
      });
      return;
    }
    // fetch list of user favorites from supabase
    try {
      const { data: savedSpots, error } = await supabase
        .from("Favorites")
        .select("location_id")
        .eq("user_id", uuid);
      if (error) {
        toast.error(`Error saving spot: ${error}`);
      }
      const savedSpotIds = savedSpots.map((spot: any) => spot.location_id);
      const isAlreadySaved = savedSpotIds.includes(marker.id!);

      // Check if the marker is already saved
      if (!isAlreadySaved) {
        // if not, add it to the list of saved locations
        const values = {
          uuid,
          username,
          location_id: marker.id,
          location_address: marker.address,
          x_coord: marker.x,
          y_coord: marker.y,
        };
        const url = queryString.stringifyUrl({
          url: "api/favorite",
          query: {
            id: params?.id,
          },
        });
        await axios.post(url, values);
      } else {
        // Remove the marker from the list of saved locations
        const { data, error } = await supabase
          .from("Favorites")
          .delete()
          .eq("user_id", uuid)
          .eq("location_id", marker.id);
        if (error) {
          toast.error(`Error removing spot from favortes: ${error}`);
        }
      }
      setIsBookmarked(!isAlreadySaved);
    } catch (error) {
      toast.error(`Something went wrong: ${error}`);
    }
  }, [markerRef, queryIcon, isBookmarked]);

  const handleGetDirections = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;

          L.Routing.control({
            waypoints: [
              L.latLng(latitude, longitude),
              L.latLng(marker.y!, marker.x!),
            ],
            lineOptions: {
              styles: [{ color: "#6FA1EC", weight: 4 }],
            },
            show: false,
            addWaypoints: false,
            routeWhileDragging: true,
            draggableWaypoints: true,
            fitSelectedRoutes: true,
            showAlternatives: false,
          }).addTo(map);
        },
        (error) => {
          toast.error(`Error getting current location: ${error.message}`);
        }
      );
    } else {
      toast.error("Geolocation is not supported by this browser.");
    }
  }, [map, marker.y, marker.x]);

  return (
    <Marker
      key={marker.id}
      ref={markerRef}
      // prettier-ignore
      icon={isBookmarked ? favoriteIcon : marker.type === "rack" ? rackIcon : signIcon}
      position={[marker.y!, marker.x!]}
      eventHandlers={{
        click: () => {
          handleFlyTo();
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
              onClick={handleSaveLocation}
              title="Save Location"
              aria-label="Save Location"
              aria-disabled="false"
              className="flex text-sm font-bold justify-center items-center w-full border-[1px] rounded-3xl border-slate-300 bg-slate-200 hover:bg-slate-300"
            >
              <Bookmark
                className={`h-7 w-7 hover:cursor-pointer fill-transparent ${
                  isBookmarked ? "fill-yellow-300" : "fill-transparent"
                }`}
              />
              Save
            </button>
            <button
              onClick={handleGetDirections}
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

export default NewMarker;

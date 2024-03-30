import React, { useState, useEffect, useRef, FC } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  useMap,
  Circle,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css";
import "leaflet-defaulticon-compatibility";
import getCoordinates from "../lib/getCoordinates";
import getUserCoordinates from "../lib/getUserCoordinates";
import { Bookmark, Layers, Locate, MyMarker, UserMarker } from "./svgs";
import L, { LatLng, map, Icon, divIcon, point, MarkerCluster } from "leaflet";
import { latLng } from "leaflet";
import "leaflet-rotate";
import MarkerClusterGroup from "react-leaflet-cluster";
import { iconUser } from "./icons/iconUser";
import Loader from "./Loader";
import { formatDate } from "@/lib/formatDate";
import prisma from "@/lib/db";
import { supabaseClient } from "@/config/supabaseClient";
import axios from "axios";
import qs from "query-string";
import { useParams, useRouter } from "next/navigation";
import { useUser } from "@/hooks/useUser";
import { debounce } from "@/hooks/useDebounce";

interface MarkerData {
  x?: number;
  y?: number;
  site_id?: string;
  ifoaddress?: string;
  rack_type?: string;
  date_inst?: string;
  order_number?: string;
  on_street?: string;
  from_street?: string;
  to_street?: string;
  sign_description?: string;
  sign_x_coord?: number;
  sign_y_coord?: number;
  favorite: boolean;
}
interface UserCoordinatesItem {
  longitude: number;
  latitude: number;
}

const customIcon = new L.Icon({
  // iconUrl: require("./svgs/MyMarker.svg").default,
  // iconSize: new L.Point(40, 47),
  iconUrl: "https://cdn-icons-png.flaticon.com/512/447/447031.png",
  iconSize: [38, 38],
});

const userIcon = new L.Icon({
  iconUrl: require("./svgs/UserMarker.svg").default,
  // iconUrl: require("./images/location-pin.png").default,
  iconSize: [38, 38],
});

const createClusterCustomIcon = function (cluster: MarkerCluster) {
  return L.divIcon({
    html: `<span class="cluster-icon">${cluster.getChildCount()}</span>`,
    className: "custom-marker-cluster",
    iconSize: point(33, 33, true),
  });
};

const currentLocationIcon = new L.Icon({
  // iconUrl: require(""),
  // https://www.svgrepo.com/svg/333873/current-location
});

type GeolocationPosition = {
  lat: number;
  lng: number;
};
type LocationStatus = "accessed" | "denied" | "unknown" | "error";

function UserLocationMarker() {
  const [locationStatus, setLocationStatus] =
    useState<LocationStatus>("unknown");
  const [position, setPosition] = useState<GeolocationPosition | null>(null);
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [prevPosition, setPrevPosition] = useState<LatLng | null>(null);
  const [userMarkerInView, setUserMarkerInView] = useState<boolean>(false);

  const map = useMap();

  useEffect(() => {
    map.locate().on("locationfound", function (e) {
      const { lat, lng } = e.latlng;
      map.flyTo(e.latlng, 19, { animate: true, duration: 1.5 });
    });
  }, [map]);

  useEffect(() => {
    let watchId: number | null = null;
    // check for geolocation support in browser
    if ("geolocation" in navigator) {
      watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude, accuracy } = position.coords;
          setPosition({ lat: latitude, lng: longitude });
          setAccuracy(accuracy);
          setLocationStatus("accessed");
        },
        (error) => {
          switch (error.code) {
            case error.PERMISSION_DENIED:
              setLocationStatus("denied");
              break;
            case error.POSITION_UNAVAILABLE:
              setLocationStatus("unknown");
              break;
            case error.TIMEOUT:
              setLocationStatus("error");
              break;
            default:
              setLocationStatus("error");
              break;
          }
        }
      );
      return () => {
        if (watchId) {
          navigator.geolocation.clearWatch(watchId);
        }
      };
    }
  }, []);

  useEffect(() => {
    if (position) {
      // console.log(`Position moved: ${position.lat} ${position.lng}`);
      const markerLatLng = latLng(position.lat, position.lng);
      const userMarkerInView = map.getBounds().contains(markerLatLng);
      setUserMarkerInView(userMarkerInView);
      if (userMarkerInView && prevPosition) {
        const distance = markerLatLng.distanceTo(prevPosition);
        // console.log(`Distance: ${distance}`);
        const thresholdDistance = 5;
        if (distance > thresholdDistance) {
          map.flyTo([position.lat, position.lng], map.getZoom(), {
            animate: true,
            duration: 1,
          });
        }
      }
      setPrevPosition(markerLatLng);
    }
  }, [position]);

  return position === null ? null : (
    <>
      <Marker position={position} icon={userIcon}>
        <Popup>You are in this area.</Popup>
      </Marker>
      {accuracy !== null && (
        <Circle
          center={[position.lat, position.lng]}
          radius={accuracy}
          // pathOptions={{ color: "blue", fillColor: "blue" }}
        />
      )}
    </>
  );
}

const locateMe = async (map: any) => {
  // console.log("Locating...");
  try {
    const userCoords = await getUserCoordinates();
    console.log(userCoords);
    if (userCoords) {
      map.flyTo([userCoords.latitude, userCoords.longitude], 19, {
        animate: true,
        duration: 1,
      });
    }
  } catch (e) {
    console.log(`Error: ${e}`);
  }
};

const MapComponent: FC = () => {
  const [userCoordinates, setUserCoordinates] =
    useState<UserCoordinatesItem | null>(null);
  const [markerData, setMarkerData] = useState<MarkerData[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [mapLayer, setMapLayer] = useState<string>("street");
  const mapRef = useRef<any | null>(null); // Declare useRef to reference map
  const maxZoom = 20;
  const supabase = supabaseClient;
  const { user } = useUser();
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const fetchData = async () => {
        setLoading(true);
        try {
          const data = await getCoordinates();
          // console.log(data);
          setMarkerData(data);
        } catch (error) {
          console.error(error);
        }
        setLoading(false);
      };

      fetchData();
    }
  }, []);

  const ZoomHandler: FC = () => {
    const map = useMap();

    const flyToMarker = (coordinates: [number, number], zoom: number) => {
      if (coordinates && typeof coordinates[0] !== "undefined") {
        map.flyTo(coordinates, zoom, {
          animate: true,
          duration: 1.5,
        });
      }
    };

    // useEffect(() => {
    //   if (userCoordinates) {
    //     flyToMarker([userCoordinates.latitude, userCoordinates.longitude], 19);
    //   }
    // }, [userCoordinates]);

    return null;
  };

  const toggleLayer = () => {
    setMapLayer(mapLayer === "street" ? "satellite" : "street");
    // console.log(mapLayer);
  };

  const handleSaveFavorite = async (marker: MarkerData) => {
    const username = user?.user_metadata.username;
    const uuid = user?.id;
    // Toggle the favorite property
    marker.favorite = !marker.favorite;

    // Update the marker data
    setMarkerData((prevMarkerData) => {
      if (!prevMarkerData) return null;

      const updatedMarkerData = prevMarkerData.map((m) => {
        if (m.site_id === marker.site_id) {
          return marker;
        }
        return m;
      });

      return updatedMarkerData;
    });

    const updateFavorites = debounce(async () => {
      try {
        if (marker.favorite) {
          const values = {
            uuid,
            username,
            location_id: marker.site_id,
            location_address: marker.ifoaddress,
            x_coord: marker.x,
            y_coord: marker.y,
          };
          const url = qs.stringifyUrl({
            url: "api/favorite",
            query: {
              id: params?.id,
            },
          });
          await axios.post(url, values);
        } else {
          const { data, error } = await supabase
            .from("Favorites")
            .delete()
            .eq("user_id", uuid)
            .eq("location_id", marker.site_id);
          if (error) {
            console.log(`Error removing spot from favortes: ${error}`);
          }
        }
      } catch (error) {
        console.error("Something went wrong:", error);
      }
    }, 300); // Debounce for x milliseconds (100ms = 1s)

    // Call the debounced function to update favorites
    updateFavorites();
  };

  // Return the JSX for rendering
  return (
    <>
      {loading && <Loader />}
      <div className="absolute bottom-0 flex flex-col justify-between m-3 gap-3">
        <button
          onClick={() => locateMe(mapRef.current)}
          title="Locate Me"
          aria-label="Locate Me"
          aria-disabled="false"
          className="z-[999] select-none cursor-pointer relative w-[36px] h-[36px] p-0 bg-white hover:bg-gray-100 text-black rounded-md border-2 border-[rgba(0,0,0,0.2)] shadow-md"
        >
          <span className="absolute top-[-16px] left-[-16px] scale-[.4]">
            <Locate />
          </span>
        </button>
        <button
          onClick={toggleLayer}
          title="Toggle Layers"
          aria-label="Toggle Layers"
          aria-disabled="false"
          className="z-[999] select-none cursor-pointer relative w-[50px] h-[50px] p-0 bg-white hover:bg-gray-100 text-black rounded-md border-2 border-[rgba(0,0,0,0.2)] shadow-md"
        >
          <span className="absolute top-[-9px] left-[-9px] scale-50">
            <Layers />
          </span>
        </button>
      </div>
      <MapContainer
        ref={mapRef}
        attributionControl={false}
        center={[40.71151957593488, -73.88017135962203]}
        zoom={11}
        // maxZoom={maxZoom}
        minZoom={1}
        style={{ height: "100vh", width: "100vw" }}
        rotate={true}
        touchRotate={true}
        rotateControl={{
          closeOnZeroBearing: false,
        }}
      >
        {mapLayer === "street" ? (
          <TileLayer
            // maxZoom={maxZoom}
            maxZoom={24}
            maxNativeZoom={19}
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        ) : (
          <TileLayer
            // maxZoom={maxZoom}
            maxZoom={24}
            maxNativeZoom={18}
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          />
        )}
        {/* <TileLayer
          maxZoom={maxZoom}
          url="https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
          subdomains={["mt1", "mt2", "mt3"]}
        /> */}
        <MarkerClusterGroup chunkedLoading>
          {markerData?.map((marker) =>
            marker.site_id ? (
              <Marker
                key={marker.site_id}
                icon={customIcon}
                position={[marker.y!, marker.x!]}
              >
                <Popup minWidth={170}>
                  <div className="popup-rack">
                    <div className="flex flex-col font-bold">
                      <p className="side_id !m-0 !p-0 text-base">
                        {marker.site_id}
                      </p>
                      <p className="rack_type !m-0 !p-0 text-base">
                        {marker.rack_type}
                      </p>
                      {/* TODO: Add # of reports here */}
                    </div>
                    <p className="ifo_address text-center text-base overflow-x-auto !my-5">
                      {marker.ifoaddress}
                    </p>
                    <div className="flex justify-between items-end">
                      <p className="date_installed italic text-xs !m-0 !p-0">
                        Date Installed: {formatDate(marker.date_inst!)}
                      </p>
                      <button onClick={() => handleSaveFavorite(marker)}>
                        <Bookmark
                          className={`h-9 w-9 absolute right-[6px] bottom-[12px] hover:cursor-pointer
                        ${
                          marker.favorite
                            ? "fill-yellow-300"
                            : "fill-transparent"
                        }
                      `}
                        />
                      </button>
                    </div>
                    {/* <button className="popup-buttons" onClick={() => handleSaveFavorite(marker)}>Save as favorite</button> */}
                  </div>
                </Popup>
              </Marker>
            ) : null
          )}
        </MarkerClusterGroup>
        <UserLocationMarker />
        <ZoomHandler />
      </MapContainer>
    </>
  );
};

export default MapComponent;

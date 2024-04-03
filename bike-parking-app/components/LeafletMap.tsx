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
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import getCoordinates from "../lib/getCoordinates";
import getUserCoordinates from "../lib/getUserCoordinates";
import {
  Bookmark,
  FavoriteMarker,
  Layers,
  Locate,
  MyMarker,
  UserMarker,
  TempMarker,
} from "./svgs";
import L, {
  LatLng,
  map,
  Icon,
  divIcon,
  point,
  MarkerCluster,
  Point,
} from "leaflet";
import { latLng } from "leaflet";
import "leaflet-rotate";
import MarkerClusterGroup from "react-leaflet-cluster";
import Loader from "./Loader";
import { formatDate } from "@/lib/formatDate";
import { supabaseClient } from "@/config/supabaseClient";
import axios from "axios";
import qs from "query-string";
import { useParams, useRouter } from "next/navigation";
import { useUser } from "@/hooks/useUser";
import { debounce } from "@/hooks/useDebounce";
import Navbar from "./navbar/Navbar";
import ReactDOMServer from "react-dom/server";
import { LatLngExpression } from 'leaflet';
import "./css/style.css";

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

// interface ModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onConfirm: () => void;
//   latlng: LatLngExpression | null;
// }

const customIcon = L.divIcon({
  className: "custom-icon",
  html: ReactDOMServer.renderToString(<MyMarker />),
  // iconSize: [10, 10],
  iconAnchor: [20, 30],
  popupAnchor: [3, -16],
});

const favoriteIcon = L.divIcon({
  className: "favorite-icon",
  html: ReactDOMServer.renderToString(<FavoriteMarker />),
  // iconSize: [10, 10],
  iconAnchor: [20, 30],
  popupAnchor: [3, -16],
});

const userIcon = L.divIcon({
  className: "user-icon",
  html: ReactDOMServer.renderToString(<UserMarker />),
  iconSize: [18, 18],
});

const tempIcon = L.divIcon({
  className: "temp-icon",
  html: ReactDOMServer.renderToString(<TempMarker />),
  iconAnchor: [22.5, 45],
  popupAnchor: [0, -45]
});

const createClusterCustomIcon = function (cluster: MarkerCluster) {
  return L.divIcon({
    html: `<span class="cluster-icon">${cluster.getChildCount()}</span>`,
    className: "custom-marker-cluster",
    iconSize: point(33, 33, true),
  });
};

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
  const params = useParams();
  const username = user?.user_metadata.username;
  const uuid = user?.id;
  const [favoriteMarkers, setFavoriteMarkers] = useState<string[]>([]);

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

  const fetchFavoriteLocations = async () => {
    try {
      const response = await supabase
        .from("Favorites")
        .select("location_id")
        .eq("user_id", uuid);
      if (response.data) {
        const favoriteLocations: string[] = response.data.map(
          (favorite) => favorite.location_id
        );
        setFavoriteMarkers(favoriteLocations);
        console.log(favoriteLocations, favoriteMarkers);
      }
    } catch (error) {
      console.error("Error fetching favorite locations:", error);
    }
  };

  // Call fetchFavoriteLocations when user is authenticated
  useEffect(() => {
    if (uuid) {
      fetchFavoriteLocations();
    }
  }, [uuid]);

  // Check if a marker is a favorite
  const isFavoriteMarker = (marker: MarkerData): boolean => {
    return favoriteMarkers.includes(marker.site_id || "");
  };

  const handleSaveFavorite = async (marker: MarkerData) => {
    const username = user?.user_metadata.username;
    const uuid = user?.id;

    if (!uuid) {
      alert("Sign in to favorite locations!");
      return;
    }

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

  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      if (file && (file.type === "image/jpeg" || file.type === "image/png")) {
        const reader = new FileReader();
        reader.onload = (loadEvent: ProgressEvent<FileReader>) => {
          const target = loadEvent.target as FileReader;
          if (target && target.result) {
            setSelectedImage(target.result.toString());
          }
        };
        reader.readAsDataURL(file);
      } else {
        console.log("Only JPG and PNG files are allowed.");
      }
    }
  };


  const TempMarkerComponent = () => {
    const [tempMarkerPos, setTempMarkerPos] = useState<L.LatLng | null>(null);
  
    useMapEvents({
      click: (e) => {
        setTempMarkerPos(e.latlng);
      },
    });
  
    return (
      <>
        {tempMarkerPos && (
          <Marker 
            position={tempMarkerPos}
            icon={tempIcon}  
          >
            <Popup className="custom-popup" autoClose={false} closeOnClick={false}>
            Do you want to add a new location at:<br />
            longitude: {tempMarkerPos.lng}, <br />latitude: {tempMarkerPos.lat}
            <input className="file-upload-button" type="file" accept=".jpg,.jpeg,.png" onChange={handleFileChange} />
          </Popup>
          </Marker>
        )}
      </>
    );
  };




  // const Modal: React.FC<ModalProps> = ({ isOpen, onClose, onConfirm, latlng }) => {
  //   if (!isOpen || !latlng) return null;
  
  //   const { lat, lng } = latlng as { lat: number; lng: number }; 
  
  //   return (
  //     <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'white', padding: '50px', zIndex: 2000 }}>
  //       <h2>Add New Location</h2>
  //       <p>Do you want to add a new location at latitude: {lat}, longitude: {lng}?</p>
  //       <br />
  //       <button onClick={onConfirm}>Confirm</button>
  //       <button onClick={onClose}>Cancel</button>
  //     </div>
  //   );
  // };

  
  // const AddLocationMarker = () => {
  //   const [modalOpen, setModalOpen] = useState(false);
  //   const [clickedLatLng, setClickedLatLng] = useState<L.LatLng | null>(null);
    
  //   const map = useMapEvents({
  //     click: (e) => {
  //       setClickedLatLng(e.latlng); 
  //       setModalOpen(true);
  //     },
  //   });
  
  //   const handleConfirm = () => {
  //     console.log("Location added:", clickedLatLng);
      
  //     setModalOpen(false);
  //   };
  
  //   const handleClose = () => {
  //     setModalOpen(false);
  //   };

  //   return (
  //     <>
  //       <Modal isOpen={modalOpen} onClose={handleClose} onConfirm={handleConfirm} latlng={clickedLatLng} />
  //     </>
  //   );
  
  // }


  // Return the JSX for rendering
  return (
    <>
      {loading && <Loader />}
      <div className="absolute sm:bottom-0 max-sm:top-0 max-sm:right-0 flex flex-col max-sm:flex-col-reverse max-sm:items-end justify-between m-3 gap-3">
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
      <Navbar />
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
        <TempMarkerComponent />
        {/* <AddLocationMarker /> */}
        <MarkerClusterGroup chunkedLoading>
          {markerData?.map((marker) =>
            marker.site_id ? (
              <Marker
                key={marker.site_id}
                icon={isFavoriteMarker(marker) ? favoriteIcon : customIcon}
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

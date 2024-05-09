"use client";
import React, {
  useState,
  useEffect,
  useRef,
  FC,
  memo,
  useCallback,
} from "react";
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
  Directions,
  FavoriteMarker,
  Layers,
  Locate,
  NoImage,
} from "./svgs";
import {
  customIcon,
  favoriteIcon,
  userIcon,
  createClusterCustomIcon,
  tempIcon,
} from "./Icons";
import L, { LatLng, map, Icon, point, MarkerCluster, Point } from "leaflet";
import { latLng } from "leaflet";
import "leaflet-rotate";
import MarkerClusterGroup from "react-leaflet-cluster";
import Loader from "./Loader";
import { formatDate } from "@/lib/formatDate";
import axios from "axios";
import qs from "query-string";
import { useParams, useRouter } from "next/navigation";
import { debounce } from "@/hooks/useDebounce";
import Navbar from "./navbar/Navbar";
import ReactDOMServer from "react-dom/server";
import RoutingMachine from "./LeafletRoutingMachine";
import ControlGeocoder from "./LeafletControlGeocoder.jsx";
import Image from "next/image";
import { getImageSource } from "@/lib/getImageSource";
import "./css/style.css";
import { createSupabaseBrowserClient } from "@/utils/supabase/browser-client";
import useSession from "@/utils/supabase/use-session";
import toast, { Toaster } from "react-hot-toast";
import "./css/style.css";
import ReportComponent from './ReportComponent';
import BusyComponent from './BusyComponent';










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
  id?: number;
}
interface UserMarker {
  x?: number;
  y?: number;
  email?: string;
  selectedOption?: string;
  favorite: boolean;
}
interface UserCoordinatesItem {
  longitude: number;
  latitude: number;
}


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


interface MemoizedMarkerProps {
  marker: MarkerData;
  isFavoriteMarker: (marker: MarkerData) => boolean;
  handleSaveFavorite: (marker: MarkerData) => void;

}


// Memoize Marker component to prevent unnecessary re-renders
const MemoizedMarker: FC<MemoizedMarkerProps> = ({
  marker,
  isFavoriteMarker,
  handleSaveFavorite,

}) => {
  const imageSize = 700;
  return (
    <Marker
      //key={marker.site_id}
      icon={isFavoriteMarker(marker) ? favoriteIcon : customIcon}
      position={[marker.y!, marker.x!]}
    >
      <Popup minWidth={170}>
        {/* <Popup minWidth={200}> */}
        <div className="popup-rack flex flex-col">
          <div className="flex flex-col font-bold">
            <p className="side_id !m-0 !p-0 text-base">{marker.site_id}</p>
            <p className="rack_type !m-0 !p-0 text-base">{marker.rack_type}</p>
            {/* TODO: Add # of reports here */}
            {marker.site_id && <ReportComponent siteId={marker.site_id} x={marker.x} y={marker.y} />}
            {/* <DeleteComponent x={marker.x} y={marker.y} site_id={marker.site_id} /> */}
            <BusyComponent x={marker.x!} y={marker.y!} />
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
            ) : (
              <div className="flex flex-col w-full items-center bg-slate-200 border-[1px] border-slate-300 rounded-lg p-3">
                <NoImage />
                <p className="!p-0 !m-0 text-xs">No image available</p>
              </div>
            )}
          </div>
          <p className="ifo_address text-center text-base overflow-x-auto !p-0 !m-0">
            {marker.ifoaddress}
          </p>
          <div className="flex flex-col gap-2 mt-1 mb-3">
            <button
              onClick={() => handleSaveFavorite(marker)}
              title="Save Location"
              aria-label="Save Location"
              aria-disabled="false"
              className="flex text-sm font-bold justify-center items-center w-full border-[1px] rounded-3xl border-slate-300 bg-slate-200 hover:bg-slate-300"
            >
              <Bookmark
                className={`h-7 w-7 hover:cursor-pointer ${isFavoriteMarker(marker)
                  ? "fill-yellow-300"
                  : "fill-transparent"
                  }`}
              />
              Save
            </button>
            <button
              onClick={() => { }}
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





          </div>
          <div className="flex justify-between items-end">
            <p className="date_installed italic text-xs !m-0 !p-0">
              {`Date Installed: `}
              {marker.date_inst &&
                new Date(marker.date_inst).getFullYear() === 1900
                ? "N/A"
                : formatDate(marker.date_inst!)}
            </p>
          </div>
          {/* <button className="popup-buttons" onClick={() => handleSaveFavorite(marker)}>Save as favorite</button> */}
        </div>
      </Popup>
    </Marker>
  );
};


const MapComponent: FC = () => {
  const [userCoordinates, setUserCoordinates] =
    useState<UserCoordinatesItem | null>(null);
  const [markerData, setMarkerData] = useState<MarkerData[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [mapLayer, setMapLayer] = useState<string>("street");
  const mapRef = useRef<any | null>(null); // Declare useRef to reference map
  const maxZoom = 20;
  const params = useParams();
  //const [favoriteMarkers, setFavoriteMarkers] = useState<string[]>([]);
  const [favoriteMarkers, setFavoriteMarkers] = useState<{ x_coord?: number; y_coord?: number; }[]>([{ x_coord: 0, y_coord: 0 }]);

  const imageSize = 700;


  const supabase = createSupabaseBrowserClient();
  const session = useSession();
  const username = session?.user.user_metadata.username;
  const uuid = session?.user.id;


  useEffect(() => {
    if (typeof window !== "undefined") {
      const fetchData = async () => {
        setLoading(true);
        try {
          const data = await getCoordinates();
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
        .select("x_coord, y_coord")
        .eq("user_id", uuid);

      if (response.data) {
        const favoriteLocations: { x_coord: number; y_coord: number }[] = response.data.map(
          (favorite) => ({
            x_coord: favorite.x_coord,
            y_coord: favorite.y_coord
          })
        );

        // Set the favorite locations
        setFavoriteMarkers(favoriteLocations);
        //console.log(favoriteMarkers);
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
  return favoriteMarkers.some(favorite =>
    favorite.x_coord == marker.x && favorite.y_coord == marker.y
  );
};



  // Memoize the handleSaveFavorite function
  const handleSaveFavorite = useCallback(
    (marker: MarkerData) => {
      const username = session?.user.user_metadata.username;
      const uuid = session?.user.id;


      if (!uuid) {
        toast.error("Sign in to favorite locations!");
        return;
      }


      const updateFavorites = debounce(async () => {
        try {
          if (!isFavoriteMarker(marker)) {
            // Check if the marker is already a favorite
            // if not, add it to the list of favoriteMarkers
            setFavoriteMarkers((prevMarkers) => [
              ...prevMarkers,
              { x_coord: marker.x, y_coord: marker.y }
            ]);


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
            marker.favorite = true;
          } else {
            setFavoriteMarkers((prevMarkers) =>
              prevMarkers.filter((favorite) => favorite.x_coord != marker.x || favorite.y_coord != marker.y)
            );
            // Remove marker from favorites
            await supabase
              .from("Favorites")
              .delete()
              .eq("user_id", uuid)
              .eq("x_coord", marker.x)
              .eq("y_coord", marker.y);

           
          }
          marker.favorite = false;
        } catch (error) {
          console.error("Something went wrong:", error);
        }
      }, 300);

      //Testing
      // console.log(favoriteMarkers);


      // Call the debounced function to update favorites
      updateFavorites();
    },
    [favoriteMarkers]
  );


  // Convert a Base64 encoded string to a Blob object
  function base64ToBlob(base64: string): Blob {
    const match = base64.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/);
    if (!match || match.length !== 2) {
      throw new Error("Invalid Base64 string");
    }
    const mime = match[1];


    const byteString = atob(base64.split(",")[1]);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }


    return new Blob([ab], { type: mime });
  }


  // Handles the addition, display and removal of temporary markers on the map, as well as image upload and submission functions.
  // Memoize the TempMarkerComponent function
  const TempMarkerComponent = () => {
    const [tempMarkerPos, setTempMarkerPos] = useState<L.LatLng | null>(null);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [showFileInput, setShowFileInput] = useState(false);
    const supabase = createSupabaseBrowserClient();
    const session = useSession();
    const username = session?.user.user_metadata.username;
    const uuid = session?.user.id;
    const email = session?.user.user_metadata.email;
    const request_type = "add_request";
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [description, setDescription] = useState('');

    //For update Add
    const [showAlert, setShowAlert] = useState(false);
    const [selectedOption, setSelectedOption] = useState('');




    // Listen for events on the map
    useMapEvents({
      // When the user clicks on the map, add a temporary marker and display the file input box
      click: (e) => {
        setTempMarkerPos(e.latlng);
        setShowFileInput(true);
        setSelectedImage(null);
        setDescription('');


        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      },


      // remove temp marker when pop-uo close
      popupclose: (e) => {
        setTempMarkerPos(null);
        setShowFileInput(false);
        setSelectedImage(null);
        setDescription('');
      },
    });


    // Monitor changes in showFileInput status
    useEffect(() => {
      if (!showFileInput) {
        setSelectedImage(null);
      }
    }, [showFileInput]);


    const addRequest = debounce(async () => {
      try {
        const requestData = {
          image: selectedImage,
          x_coord: tempMarkerPos?.lng,
          y_coord: tempMarkerPos?.lat,
          request_type: request_type,
          email: email,
          description: description,
          selectedOption: selectedOption,
        };


        const response = await axios.post("/api/request", requestData);
        if (response.status === 200) {
          console.log("Request successfully added:", response.data);
        } else {
          console.log("Error adding request:", response.statusText);
        }
      } catch (error) {
        console.error("Server error:", error);
      }
    }, 300);


    // Check if the user is logged in. Then, if there is an image selected, call base64ToBlob function to covert the object
    const handleSubmit = async () => {
      if (!uuid) {
        toast.error("Sign in to submit request!");
        return;
      }
      if (selectedOption === "") {
        toast.error("Please select a type");
        return;
      }

      addRequest();

      const request_type = "add_request";
      console.log(email);
      let imageBlob: Blob | null = null;
      if (selectedImage !== null) {
        imageBlob = base64ToBlob(selectedImage);
      }
      console.log(imageBlob);
      console.log(tempMarkerPos?.lat);
      console.log(tempMarkerPos?.lng);
      console.log(request_type);
      console.log(description);
      console.log(selectedOption);


      setDescription('');
      setSelectedOption('');
    };


    // Handle file selection input and Set the selectedImage state so that the image preview is displayed.
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


    // Clear the selectedImage state and reset the file input box, thereby removing the image preview.
    const handleRemoveImage = (event: React.MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation();
      setSelectedImage(null);


      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    };
    const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setSelectedOption(event.target.value);
      setShowAlert(false);
      console.log("Option selected:", event.target.value);
    };


    return (
      <>
        {tempMarkerPos && (
          <Marker position={tempMarkerPos} icon={tempIcon}>
            <Popup
              className="custom-popup"
              autoClose={false}
              closeOnClick={false}
            >
              Do you want to add a new location at:
              <br />
              longitude: {tempMarkerPos.lng}, <br />
              latitude: {tempMarkerPos.lat}
              {/* <input className="file-upload-button" type="file" accept=".jpg,.jpeg,.png" onChange={handleFileChange} /> */}
              {showFileInput && (
                <>
                  <input
                    ref={fileInputRef}
                    className="file-upload-button"
                    type="file"
                    accept=".jpg,.jpeg,.png"
                    onChange={handleFileChange}
                  />
                  {/* {selectedImage && <img src={selectedImage} alt="Preview" />} */}
                  {selectedImage && (
                    <div>
                      <img
                        src={selectedImage}
                        alt="Preview"
                        style={{ width: "100%", marginTop: "10px" }}
                      />
                      <button onClick={handleRemoveImage}>Remove</button>


                      {/* Option to let user to delcare the type of bike stop */}
                      <div className="options">
                        <label className="option">
                          <input type="radio" name="reportOption" value="u rack" onChange={handleOptionChange} />
                          U-Rack
                        </label>
                        <label className="option">
                          <input type="radio" name="reportOption" value="large hoop" onChange={handleOptionChange} />
                          large hoop
                        </label>
                        <label className="option">
                          <input type="radio" name="reportOption" value="small hoop" onChange={handleOptionChange} />
                          small hoop
                        </label>
                        <label className="option">
                          <input type="radio" name="reportOption" value="wave" onChange={handleOptionChange} />
                          wave
                        </label>
                        <label className="option">
                          <input type="radio" name="reportOption" value="opal" onChange={handleOptionChange} />
                          opal
                        </label>
                        <label className="option">
                          <input type="radio" name="reportOption" value="staple" onChange={handleOptionChange} />
                          staple
                        </label>
                      </div>
                      {/* {showAlert && <p className="alert">Please select a type.</p>} */}


                      <button
                        onClick={handleSubmit}
                        style={{
                          position: "absolute",
                          bottom: "10px",
                          right: "10px",
                          zIndex: 1000,
                        }}
                      >
                        Submit
                      </button>
                    </div>
                  )}
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Add description for the location"
                    style={{ width: '100%' }}
                  />
                </>
              )}
            </Popup>
          </Marker>
        )}
      </>
    );
  };


  // Making Marker for user added location
  function UserAddMarker() {
    const [usermarkerData, setUserMarkerData] = useState<UserMarker[] | null>(null);
    const supabase = createSupabaseBrowserClient();


    useEffect(() => {
      async function fetchData() {
        try {
          const { data, error } = await supabase
            .from('UserAdded')
            .select('x_coord, y_coord, email,selectedOption');


          if (error) {
            throw error;
          }


          if (data) {
            const userMarkers: UserMarker[] = data.map((item: any) => ({
              x: item.x_coord,
              y: item.y_coord,
              email: item.email,
              selectedOption: item.selectedOption,
              favorite: item.favorite,
            }));
            setUserMarkerData(userMarkers);
          }
        } catch (error: any) {
          console.error('Error fetching data from Supabase:', error.message);
        }
      }


      fetchData();
    }, []);
    return (
      <div style={{ height: '400px' }}>
        {usermarkerData && 
          usermarkerData.map((marker, index) => (
            <div key={index}>
              <Marker position={[marker.y || 0, marker.x || 0]} icon={isFavoriteMarker(marker) ? favoriteIcon : customIcon}>
                <Popup>Added by: {marker.email}
                  <div className="my-1 flex justify-center items-center select-none pointer-events-none">
                    {marker.selectedOption && getImageSource(marker.selectedOption) ? (
                      <Image
                        className="rounded-md shadow"
                        src={getImageSource(marker.selectedOption)}
                        alt={marker.selectedOption}
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
                  <div className="flex flex-col gap-2 mt-1 mb-3">
                    <button
                      onClick={() => handleSaveFavorite(marker)}
                      title="Save Location2"
                      aria-label="Save Location2"
                      aria-disabled="false"
                      className="flex text-sm font-bold justify-center items-center w-full border-[1px] rounded-3xl border-slate-300 bg-slate-200 hover:bg-slate-300"
                    >
                      <Bookmark
                        className={`h-7 w-7 hover:cursor-pointer ${isFavoriteMarker(marker)
                          ? "fill-yellow-300"
                          : "fill-transparent"
                          }`}
                      />
                      Save
                    </button>
                    <button
                      onClick={() => { }}
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



                    

                  </div>
                  <ReportComponent siteId={""} x={marker.x} y={marker.y}/> 
                 
               
                </Popup>

              </Marker>
            </div>
          ))
        }
      </div>
    );

  };




  // Return the JSX for rendering
  return (
    <>
      <Toaster />
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
        <UserAddMarker />
        {!loading && (
          <MarkerClusterGroup chunkedLoading maxClusterRadius={160}>
            {markerData?.map((marker) =>
              marker.site_id ? (
                <MemoizedMarker
                  key={marker.site_id}
                  marker={marker}
                  isFavoriteMarker={isFavoriteMarker}
                  handleSaveFavorite={handleSaveFavorite}

                />
              ) : null
            )}
          </MarkerClusterGroup>
        )}


        <UserLocationMarker />
        <ZoomHandler />
        {/* <RoutingMachine />  */}
        <ControlGeocoder />
      </MapContainer>
    </>
  );
};


export default MapComponent;
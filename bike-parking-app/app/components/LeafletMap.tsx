  import React, { useState, useEffect, useRef, FC } from "react";
  import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    useMapEvents,
    useMap,
  } from "react-leaflet";
  import "leaflet/dist/leaflet.css";
  // import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css";
  // import "leaflet-defaulticon-compatibility";
  import getCoordinates from "../lib/getCoordinates";
  import getUserCoordinates from "../lib/getUserCoordinates";

  interface MarkerData {
    coordinates: [number, number];
    title: string;
  }
  interface UserCoordinatesItem {
    longitude: number;
    latitude: number;
  }

  // Loader component for showing loading animation
  const Loader = () => {
    return (
      <div className="absolute select-none flex flex-col justify-center items-center gap-5 z-[10000] h-screen w-screen bg-black bg-opacity-50">
        <svg
          aria-hidden="true"
          className="w-24 h-24 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
          viewBox="0 0 100 101"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            fill="currentColor"
          />
          <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            fill="currentFill"
          />
        </svg>
        <p className="font-mono text-2xl text-white tracking-wide font-semibold">
          Loading...
        </p>
      </div>
    );
  };

  const MapComponent: FC = () => {
    const [userCoordinates, setUserCoordinates] = useState<UserCoordinatesItem | null>(null);
    const [markerData, setMarkerData] = useState<MarkerData | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const mapRef = useRef<any | null>(null);  // Declare useRef to reference map
    const maxZoom = 20;

    useEffect(() => {
      if (typeof window !== "undefined") {
        const fetchData = async () => {
          setLoading(true);
          try {
            const userCoords = await getUserCoordinates();
            console.log("User coordinates:", userCoords);
            setUserCoordinates(userCoords);

            const data = await getCoordinates();
            console.log(data);
            // setMarkerData(data);
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
  
      useEffect(() => {
        if (userCoordinates) {
          map.flyTo([userCoordinates.latitude, userCoordinates.longitude], 18, {
            animate: true,
            duration: 1.5,
          });
        }
      }, [map, userCoordinates]);
  
      return null;
    };
  
    // Return the JSX for rendering
    return (
      <>
        {loading && <Loader />}
        <MapContainer
          attributionControl={false}
          center={[40.71151957593488, -73.88017135962203]}
          zoom={11}
          maxZoom={maxZoom}
          style={{ height: "100vh", width: "100vw" }}
        >
          <TileLayer
            maxZoom={maxZoom}
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {/* Conditionally render the marker */}
          {markerData && markerData.coordinates && (
            <Marker position={markerData.coordinates}>
              <Popup>{markerData.title}</Popup>
            </Marker>
          )}
          <ZoomHandler />
        </MapContainer>
      </>
    );
  };
  //25. Export the MapComponent.
  export default MapComponent;

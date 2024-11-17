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

// import { LatLng, latLng } from "leaflet";
// import { useEffect, useState } from "react";
// import { Circle, Marker, Popup, useMap, useMapEvents } from "react-leaflet";
// import { userIcon } from "../Icons";
// import toast from "react-hot-toast";
// import { Locate } from "../svgs";

// type GeolocationPosition = {
//   lat: number;
//   lng: number;
// };
// type LocationStatus = "accessed" | "denied" | "unknown" | "error";

// function UserLocationMarker() {
//   const [locationStatus, setLocationStatus] =
//     useState<LocationStatus>("unknown");
//   const [position, setPosition] = useState<GeolocationPosition | null>(null);
//   const [accuracy, setAccuracy] = useState<number | null>(null);
//   const [prevPosition, setPrevPosition] = useState<LatLng | null>(null);
//   const [userMarkerInView, setUserMarkerInView] = useState<boolean>(false);
//   const [buttonDisabled, setButtonDisabled] = useState(false);

//   const map = useMap();

//   const handleLocateClick = () => {
//     setButtonDisabled(true);
//     setTimeout(() => {
//       setButtonDisabled(false);
//     }, 1000);
//     map.locate();
//   };

//   useMapEvents({
//     locationfound: (e) => {
//       setPosition({ lat: e.latlng.lat, lng: e.latlng.lng });
//       setAccuracy(e.accuracy);
//       setLocationStatus("accessed");
//       map.flyTo(e.latlng, 19, { duration: 1 });
//     },
//     locationerror: (err) => {
//       toast.error(
//         <div className="flex flex-col">
//           <h1 className="font-bold underline">
//             {`Error accessing user location: `}
//           </h1>
//           {err.message}
//         </div>,
//         {
//           id: `location-error`,
//         }
//       );
//     },
//   });

//   useEffect(() => {
//     map.locate().on("locationfound", function (e) {
//       const { lat, lng } = e.latlng;
//       map.flyTo(e.latlng, 19, { animate: true, duration: 1.5 });
//     });
//   }, [map]);

//   useEffect(() => {
//     let watchId: number | null = null;
//     // check for geolocation support in browser
//     if ("geolocation" in navigator) {
//       watchId = navigator.geolocation.watchPosition(
//         (position) => {
//           const { latitude, longitude, accuracy } = position.coords;
//           setPosition({ lat: latitude, lng: longitude });
//           setAccuracy(accuracy);
//           setLocationStatus("accessed");
//         },
//         (error) => {
//           switch (error.code) {
//             case error.PERMISSION_DENIED:
//               setLocationStatus("denied");
//               break;
//             case error.POSITION_UNAVAILABLE:
//               setLocationStatus("unknown");
//               break;
//             case error.TIMEOUT:
//               setLocationStatus("error");
//               break;
//             default:
//               setLocationStatus("error");
//               break;
//           }
//         },
//         { enableHighAccuracy: true }
//       );
//       return () => {
//         if (watchId) {
//           navigator.geolocation.clearWatch(watchId);
//         }
//       };
//     }
//   }, []);

//   useEffect(() => {
//     if (position) {
//       // console.log(`Position moved: ${position.lat} ${position.lng}`);
//       const markerLatLng = latLng(position.lat, position.lng);
//       const userMarkerInView = map.getBounds().contains(markerLatLng);
//       setUserMarkerInView(userMarkerInView);
//       if (userMarkerInView && prevPosition) {
//         const distance = markerLatLng.distanceTo(prevPosition);
//         // console.log(`Distance: ${distance}`);
//         const thresholdDistance = 5;
//         if (distance > thresholdDistance) {
//           map.flyTo([position.lat, position.lng], map.getZoom(), {
//             animate: true,
//             duration: 1,
//           });
//         }
//       }
//       setPrevPosition(markerLatLng);
//     }
//   }, [position]);

//   return (
//     <>
//       <button
//         onClick={handleLocateClick}
//         className="z-[999] select-none cursor-pointer absolute top-[170px] left-[9px] w-[36px] h-[36px] p-0 bg-white hover:bg-gray-100 text-black rounded-md border-2 border-[rgba(0,0,0,0.2)] shadow-md"
//         title="Find my location"
//         aria-label="Find my location"
//         aria-disabled="false"
//         disabled={buttonDisabled}
//       >
//         <span className="absolute top-[-16px] left-[-16px] scale-[.4]">
//           <Locate />
//         </span>
//       </button>

//       {position !== null && (
//         <>
//           <Marker position={position} icon={userIcon}>
//             <Popup>You are in this area.</Popup>
//           </Marker>
//           {accuracy !== null && (
//             <Circle
//               center={position}
//               radius={accuracy}
//               // pathOptions={{ color: "blue", fillColor: "blue" }}
//             />
//           )}
//         </>
//       )}
//     </>
//   );
// }

// export default UserLocationMarker;

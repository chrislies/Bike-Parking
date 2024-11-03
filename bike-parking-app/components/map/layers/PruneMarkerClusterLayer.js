// import getCoordinates from "@/lib/getCoordinates";
// import React, { useEffect, useRef, useState } from "react";
// import { useMap } from "react-leaflet";
// import { PruneCluster, PruneClusterForLeaflet } from "prunecluster-exportable";
// import "leaflet/dist/leaflet.css";
// import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css"; // Re-uses images from ~leaflet package
// import "leaflet-defaulticon-compatibility";
// import Loader from "@/components/Loader";
// import "leaflet-routing-machine";
// import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
// import toast from "react-hot-toast";
// import { Bookmark, Directions, NoImage } from "../../svgs";
// import { queryIcon, transparentIcon } from "@/components/Icons";
// import { marker, tooltip } from "leaflet";
// import Link from "next/link";
// import { getImageSource } from "@/lib/getImageSource";
// import { formatDate } from "@/lib/formatDate";
// import RouteLayer from "./RouteLayer";

// const imageSize = 700;
// const NoImageSVG = `<svg fill="currentColor" width="64px" height="64px" viewBox="0 0 32 32" id="icon" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><defs><style>.cls-1{fill:none;}</style></defs><title>no-image</title><path d="M30,3.4141,28.5859,2,2,28.5859,3.4141,30l2-2H26a2.0027,2.0027,0,0,0,2-2V5.4141ZM26,26H7.4141l7.7929-7.793,2.3788,2.3787a2,2,0,0,0,2.8284,0L22,19l4,3.9973Zm0-5.8318-2.5858-2.5859a2,2,0,0,0-2.8284,0L19,19.1682l-2.377-2.3771L26,7.4141Z"></path><path d="M6,22V19l5-4.9966,1.3733,1.3733,1.4159-1.416-1.375-1.375a2,2,0,0,0-2.8284,0L6,16.1716V6H22V4H6A2.002,2.002,0,0,0,4,6V22Z"></path><rect id="_Transparent_Rectangle_" data-name="<Transparent Rectangle>" class="cls-1" width="32" height="32"></rect></g></svg>`;
// const DirectionsSVG = `<svg class="h-7 w-7 hover:cursor-pointer items-end" width="64px" height="64px" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M12 21.25C11.7623 21.25 11.5269 21.2033 11.3073 21.1123C11.0877 21.0214 10.8881 20.8881 10.72 20.72L3.28 13.28C3.11188 13.1119 2.97853 12.9124 2.88754 12.6928C2.79656 12.4731 2.74973 12.2377 2.74973 12C2.74973 11.7623 2.79656 11.5269 2.88754 11.3073C2.97853 11.0876 3.11188 10.8881 3.28 10.72L10.72 3.28001C11.0656 2.95224 11.5237 2.76953 12 2.76953C12.4763 2.76953 12.9344 2.95224 13.28 3.28001L20.72 10.72C20.8881 10.8881 21.0215 11.0876 21.1125 11.3073C21.2034 11.5269 21.2503 11.7623 21.2503 12C21.2503 12.2377 21.2034 12.4731 21.1125 12.6928C21.0215 12.9124 20.8881 13.1119 20.72 13.28L13.28 20.72C13.1119 20.8881 12.9123 21.0214 12.6927 21.1123C12.4731 21.2033 12.2377 21.25 12 21.25ZM12 4.25001C11.9605 4.24875 11.9213 4.25616 11.885 4.27171C11.8487 4.28726 11.8163 4.31057 11.79 4.34001L4.34 11.79C4.31156 11.8171 4.28892 11.8497 4.27345 11.8858C4.25798 11.9219 4.25 11.9607 4.25 12C4.25 12.0393 4.25798 12.0782 4.27345 12.1143C4.28892 12.1503 4.31156 12.1829 4.34 12.21L11.79 19.66C11.8127 19.6951 11.8438 19.7239 11.8804 19.7439C11.9171 19.7639 11.9582 19.7744 12 19.7744C12.0418 19.7744 12.0829 19.7639 12.1196 19.7439C12.1562 19.7239 12.1873 19.6951 12.21 19.66L19.66 12.21C19.6884 12.1829 19.7111 12.1503 19.7266 12.1143C19.742 12.0782 19.75 12.0393 19.75 12C19.75 11.9607 19.742 11.9219 19.7266 11.8858C19.7111 11.8497 19.6884 11.8171 19.66 11.79L12.21 4.34001C12.1837 4.31057 12.1513 4.28726 12.115 4.27171C12.0787 4.25616 12.0395 4.24875 12 4.25001Z" fill="currentColor"></path> <path d="M13.27 14.42C13.1714 14.4205 13.0738 14.4013 12.9828 14.3635C12.8918 14.3257 12.8092 14.2701 12.74 14.2C12.5995 14.0594 12.5207 13.8688 12.5207 13.67C12.5207 13.4713 12.5995 13.2807 12.74 13.14L14.44 11.46L12.74 9.78003C12.6663 9.71137 12.6072 9.62857 12.5662 9.53657C12.5252 9.44457 12.5032 9.34526 12.5014 9.24455C12.4996 9.14385 12.5181 9.04382 12.5559 8.95043C12.5936 8.85705 12.6497 8.77221 12.721 8.70099C12.7922 8.62978 12.877 8.57363 12.9704 8.53591C13.0638 8.49819 13.1638 8.47966 13.2645 8.48144C13.3652 8.48322 13.4645 8.50526 13.5565 8.54625C13.6485 8.58724 13.7313 8.64635 13.8 8.72003L16 10.93C16.071 10.9998 16.1275 11.0831 16.166 11.175C16.2045 11.2668 16.2244 11.3654 16.2244 11.465C16.2244 11.5646 16.2045 11.6633 16.166 11.7551C16.1275 11.847 16.071 11.9302 16 12L13.8 14.2C13.7307 14.2701 13.6482 14.3257 13.5572 14.3635C13.4662 14.4013 13.3685 14.4205 13.27 14.42Z" fill="currentColor"></path> <path d="M8.5 15C8.30189 14.9974 8.11263 14.9176 7.97253 14.7775C7.83244 14.6374 7.75259 14.4481 7.75 14.25V11.46C7.75259 11.2619 7.83244 11.0727 7.97253 10.9326C8.11263 10.7925 8.30189 10.7126 8.5 10.71H15.5C15.6989 10.71 15.8897 10.789 16.0303 10.9297C16.171 11.0703 16.25 11.2611 16.25 11.46C16.25 11.6589 16.171 11.8497 16.0303 11.9904C15.8897 12.131 15.6989 12.21 15.5 12.21H9.25V14.21C9.25402 14.3115 9.23766 14.4127 9.20189 14.5078C9.16613 14.6028 9.11168 14.6897 9.04177 14.7633C8.97185 14.837 8.88789 14.8959 8.79484 14.9365C8.70179 14.9772 8.60154 14.9988 8.5 15Z" fill="currentColor"></path> </g></svg>`;
// const BookmarkSVG = `<svg class="h-7 w-7 fill-transparent" width="64px" height="64px" viewBox="0 -0.5 25 25" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M18.507 19.853V6.034C18.5116 5.49905 18.3034 4.98422 17.9283 4.60277C17.5532 4.22131 17.042 4.00449 16.507 4H8.50705C7.9721 4.00449 7.46085 4.22131 7.08577 4.60277C6.7107 4.98422 6.50252 5.49905 6.50705 6.034V19.853C6.45951 20.252 6.65541 20.6407 7.00441 20.8399C7.35342 21.039 7.78773 21.0099 8.10705 20.766L11.907 17.485C12.2496 17.1758 12.7705 17.1758 13.113 17.485L16.9071 20.767C17.2265 21.0111 17.6611 21.0402 18.0102 20.8407C18.3593 20.6413 18.5551 20.2522 18.507 19.853Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>`;
// const SavedBookmarkSVG = `<svg class="h-7 w-7 fill-yellow-300" width="64px" height="64px" viewBox="0 -0.5 25 25" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M18.507 19.853V6.034C18.5116 5.49905 18.3034 4.98422 17.9283 4.60277C17.5532 4.22131 17.042 4.00449 16.507 4H8.50705C7.9721 4.00449 7.46085 4.22131 7.08577 4.60277C6.7107 4.98422 6.50252 5.49905 6.50705 6.034V19.853C6.45951 20.252 6.65541 20.6407 7.00441 20.8399C7.35342 21.039 7.78773 21.0099 8.10705 20.766L11.907 17.485C12.2496 17.1758 12.7705 17.1758 13.113 17.485L16.9071 20.767C17.2265 21.0111 17.6611 21.0402 18.0102 20.8407C18.3593 20.6413 18.5551 20.2522 18.507 19.853Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>`;

// const PruneMarkerClusterLayer = ({ coordinatesData, showLayer }) => {
//   const map = useMap();
//   const pruneClusterRef = useRef(null);
//   const savedLocationsRef = useRef([]);

//   useEffect(() => {
//     console.log(showLayer);

//     if (!pruneClusterRef.current) {
//       pruneClusterRef.current = new PruneClusterForLeaflet();
//     }

//     if (showLayer && coordinatesData && coordinatesData.length > 0) {
//       coordinatesData.forEach((coordinate) => {
//         const marker = new PruneCluster.Marker(coordinate.y, coordinate.x, {
//           title: "title",
//           tooltip: coordinate.rack_type,
//         });
//         let imageSource;
//         if (coordinate.rack_type && getImageSource(coordinate.rack_type)) {
//           imageSource = `<img class="rounded-md shadow" height=${imageSize} width=${imageSize} src="${getImageSource(
//             coordinate.rack_type
//           )}" alt="${coordinate.rack_type}"></img>`;
//         } else if (coordinate.type === "sign") {
//           imageSource = `<img class="rounded-md shadow" height=${imageSize} width=${imageSize} src="/images/streetsign.jpg" alt="street sign"></img>`;
//         } else {
//           imageSource = `<div class="flex flex-col w-full items-center bg-slate-200 border-[1px] border-slate-300 rounded-lg p-3">${NoImageSVG}<p class="!p-0 !m-0 text-xs">No image available</p></div>`;
//         }

//         marker.data.popup = `
//             <div class="flex flex-col">
//               <p class="!m-0 !p-0 text-base font-extrabold font-sans">${
//                 coordinate.rack_type ? coordinate.rack_type : "Street Sign"
//               }</p>
//               ${
//                 coordinate.type === "sign"
//                   ? `<div class="relative"><div class="my-1 flex justify-center items-center select-none">${imageSource}</div><div class="absolute bottom-0 my-1 flex justify-center items-center bg-black/85 w-full h-[94%] px-1 rounded-md opacity-0 hover:opacity-100 duration-500 ease-in-out transition-all overflow-auto"><p class="text-xs text-white font-mono">${coordinate.sign_description}</p></div></div>`
//                   : `<div class="my-1 flex justify-center items-center select-none pointer-events-none">${imageSource}</div>`
//               }
//               <p class="text-center ${
//                 coordinate.type === "rack"
//                   ? "text-base overflow-x-auto"
//                   : "max-w-[170px] text-sm tracking-tight"
//               } hover:underline !p-0 !m-0"><a href="https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${
//           coordinate.y
//         },${coordinate.x}" target="_blank" class="!text-black">${
//           coordinate.address
//         }</a></p>
//               <div class="flex flex-col gap-2 mt-1 mb-3">
//                 <button id="save-location-${
//                   coordinate.id
//                 }" title="Save Location" aria-label="Save Location" aria-disabled="false" class="save-location-btn flex text-sm font-bold justify-center items-center w-full border-[1px] rounded-3xl border-slate-300 bg-slate-200 hover:bg-slate-300">
//                   ${
//                     savedLocationsRef.current.includes(coordinate.id)
//                       ? `${SavedBookmarkSVG} Saved`
//                       : `${BookmarkSVG} Save`
//                   }
//                 </button>
//                 <button id="get-directions-${
//                   coordinate.id
//                 }" title="Directions" aria-label="Directions" class="get-directions-btn flex text-sm font-bold justify-center items-center w-full border-[1px] rounded-3xl border-blue-600 hover:shadow-lg gap-1 text-white bg-blue-600">
//                   ${DirectionsSVG} Directions
//                 </button>
//               </div>
//               ${
//                 coordinate.rack_type
//                   ? `<div class="popup dateInst"><i>Date Installed: ${formatDate(
//                       coordinate.date_inst
//                     )}</i></div>`
//                   : ""
//               }
//             </div>
//           `;
//         pruneClusterRef.current.RegisterMarker(marker);
//       });

//       map.addLayer(pruneClusterRef.current);
//     } else {
//       if (pruneClusterRef.current) {
//         pruneClusterRef.current.RemoveMarkers();
//         map.removeLayer(pruneClusterRef.current);
//       }
//     }

//     // Cleanup on unmount
//     return () => {
//       if (pruneClusterRef.current) {
//         pruneClusterRef.current.RemoveMarkers();
//         map.removeLayer(pruneClusterRef.current);
//       }
//     };
//   }, [map, coordinatesData, showLayer]);

//   return null; // Modify this to render your custom marker cluster layer component
// };

// export default PruneMarkerClusterLayer;

import getCoordinates from "@/lib/getCoordinates";
import React, { useEffect, useRef, useState } from "react";
import { useMap } from "react-leaflet";
import { PruneCluster, PruneClusterForLeaflet } from "prunecluster-exportable";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css"; // Re-uses images from ~leaflet package
import "leaflet-defaulticon-compatibility";
import Loader from "@/components/Loader";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import toast from "react-hot-toast";
import { Bookmark, Directions, NoImage } from "../../svgs";
import { queryIcon, transparentIcon } from "@/components/Icons";
import { marker, tooltip } from "leaflet";
import Link from "next/link";
import { getImageSource } from "@/lib/getImageSource";
import { formatDate } from "@/lib/formatDate";
import RouteLayer from "./RouteLayer";

const imageSize = 700;
const NoImageSVG = `<svg fill="currentColor" width="64px" height="64px" viewBox="0 0 32 32" id="icon" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><defs><style>.cls-1{fill:none;}</style></defs><title>no-image</title><path d="M30,3.4141,28.5859,2,2,28.5859,3.4141,30l2-2H26a2.0027,2.0027,0,0,0,2-2V5.4141ZM26,26H7.4141l7.7929-7.793,2.3788,2.3787a2,2,0,0,0,2.8284,0L22,19l4,3.9973Zm0-5.8318-2.5858-2.5859a2,2,0,0,0-2.8284,0L19,19.1682l-2.377-2.3771L26,7.4141Z"></path><path d="M6,22V19l5-4.9966,1.3733,1.3733,1.4159-1.416-1.375-1.375a2,2,0,0,0-2.8284,0L6,16.1716V6H22V4H6A2.002,2.002,0,0,0,4,6V22Z"></path><rect id="_Transparent_Rectangle_" data-name="<Transparent Rectangle>" class="cls-1" width="32" height="32"></rect></g></svg>`;
const DirectionsSVG = `<svg class="h-7 w-7 hover:cursor-pointer items-end" width="64px" height="64px" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M12 21.25C11.7623 21.25 11.5269 21.2033 11.3073 21.1123C11.0877 21.0214 10.8881 20.8881 10.72 20.72L3.28 13.28C3.11188 13.1119 2.97853 12.9124 2.88754 12.6928C2.79656 12.4731 2.74973 12.2377 2.74973 12C2.74973 11.7623 2.79656 11.5269 2.88754 11.3073C2.97853 11.0876 3.11188 10.8881 3.28 10.72L10.72 3.28001C11.0656 2.95224 11.5237 2.76953 12 2.76953C12.4763 2.76953 12.9344 2.95224 13.28 3.28001L20.72 10.72C20.8881 10.8881 21.0215 11.0876 21.1125 11.3073C21.2034 11.5269 21.2503 11.7623 21.2503 12C21.2503 12.2377 21.2034 12.4731 21.1125 12.6928C21.0215 12.9124 20.8881 13.1119 20.72 13.28L13.28 20.72C13.1119 20.8881 12.9123 21.0214 12.6927 21.1123C12.4731 21.2033 12.2377 21.25 12 21.25ZM12 4.25001C11.9605 4.24875 11.9213 4.25616 11.885 4.27171C11.8487 4.28726 11.8163 4.31057 11.79 4.34001L4.34 11.79C4.31156 11.8171 4.28892 11.8497 4.27345 11.8858C4.25798 11.9219 4.25 11.9607 4.25 12C4.25 12.0393 4.25798 12.0782 4.27345 12.1143C4.28892 12.1503 4.31156 12.1829 4.34 12.21L11.79 19.66C11.8127 19.6951 11.8438 19.7239 11.8804 19.7439C11.9171 19.7639 11.9582 19.7744 12 19.7744C12.0418 19.7744 12.0829 19.7639 12.1196 19.7439C12.1562 19.7239 12.1873 19.6951 12.21 19.66L19.66 12.21C19.6884 12.1829 19.7111 12.1503 19.7266 12.1143C19.742 12.0782 19.75 12.0393 19.75 12C19.75 11.9607 19.742 11.9219 19.7266 11.8858C19.7111 11.8497 19.6884 11.8171 19.66 11.79L12.21 4.34001C12.1837 4.31057 12.1513 4.28726 12.115 4.27171C12.0787 4.25616 12.0395 4.24875 12 4.25001Z" fill="currentColor"></path> <path d="M13.27 14.42C13.1714 14.4205 13.0738 14.4013 12.9828 14.3635C12.8918 14.3257 12.8092 14.2701 12.74 14.2C12.5995 14.0594 12.5207 13.8688 12.5207 13.67C12.5207 13.4713 12.5995 13.2807 12.74 13.14L14.44 11.46L12.74 9.78003C12.6663 9.71137 12.6072 9.62857 12.5662 9.53657C12.5252 9.44457 12.5032 9.34526 12.5014 9.24455C12.4996 9.14385 12.5181 9.04382 12.5559 8.95043C12.5936 8.85705 12.6497 8.77221 12.721 8.70099C12.7922 8.62978 12.877 8.57363 12.9704 8.53591C13.0638 8.49819 13.1638 8.47966 13.2645 8.48144C13.3652 8.48322 13.4645 8.50526 13.5565 8.54625C13.6485 8.58724 13.7313 8.64635 13.8 8.72003L16 10.93C16.071 10.9998 16.1275 11.0831 16.166 11.175C16.2045 11.2668 16.2244 11.3654 16.2244 11.465C16.2244 11.5646 16.2045 11.6633 16.166 11.7551C16.1275 11.847 16.071 11.9302 16 12L13.8 14.2C13.7307 14.2701 13.6482 14.3257 13.5572 14.3635C13.4662 14.4013 13.3685 14.4205 13.27 14.42Z" fill="currentColor"></path> <path d="M8.5 15C8.30189 14.9974 8.11263 14.9176 7.97253 14.7775C7.83244 14.6374 7.75259 14.4481 7.75 14.25V11.46C7.75259 11.2619 7.83244 11.0727 7.97253 10.9326C8.11263 10.7925 8.30189 10.7126 8.5 10.71H15.5C15.6989 10.71 15.8897 10.789 16.0303 10.9297C16.171 11.0703 16.25 11.2611 16.25 11.46C16.25 11.6589 16.171 11.8497 16.0303 11.9904C15.8897 12.131 15.6989 12.21 15.5 12.21H9.25V14.21C9.25402 14.3115 9.23766 14.4127 9.20189 14.5078C9.16613 14.6028 9.11168 14.6897 9.04177 14.7633C8.97185 14.837 8.88789 14.8959 8.79484 14.9365C8.70179 14.9772 8.60154 14.9988 8.5 15Z" fill="currentColor"></path> </g></svg>`;
const BookmarkSVG = `<svg class="h-7 w-7 fill-transparent" width="64px" height="64px" viewBox="0 -0.5 25 25" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M18.507 19.853V6.034C18.5116 5.49905 18.3034 4.98422 17.9283 4.60277C17.5532 4.22131 17.042 4.00449 16.507 4H8.50705C7.9721 4.00449 7.46085 4.22131 7.08577 4.60277C6.7107 4.98422 6.50252 5.49905 6.50705 6.034V19.853C6.45951 20.252 6.65541 20.6407 7.00441 20.8399C7.35342 21.039 7.78773 21.0099 8.10705 20.766L11.907 17.485C12.2496 17.1758 12.7705 17.1758 13.113 17.485L16.9071 20.767C17.2265 21.0111 17.6611 21.0402 18.0102 20.8407C18.3593 20.6413 18.5551 20.2522 18.507 19.853Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>`;
const SavedBookmarkSVG = `<svg class="h-7 w-7 fill-yellow-300" width="64px" height="64px" viewBox="0 -0.5 25 25" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M18.507 19.853V6.034C18.5116 5.49905 18.3034 4.98422 17.9283 4.60277C17.5532 4.22131 17.042 4.00449 16.507 4H8.50705C7.9721 4.00449 7.46085 4.22131 7.08577 4.60277C6.7107 4.98422 6.50252 5.49905 6.50705 6.034V19.853C6.45951 20.252 6.65541 20.6407 7.00441 20.8399C7.35342 21.039 7.78773 21.0099 8.10705 20.766L11.907 17.485C12.2496 17.1758 12.7705 17.1758 13.113 17.485L16.9071 20.767C17.2265 21.0111 17.6611 21.0402 18.0102 20.8407C18.3593 20.6413 18.5551 20.2522 18.507 19.853Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>`;

const PruneMarkerClusterLayer = () => {
  const map = useMap();
  const [loading, setLoading] = useState(false);
  const [routeCoordinates, setRouteCoordinates] = useState(null);
  const [savedLocations, setSavedLocations] = useState([]);
  const [showLayer, setShowLayer] = useState(true); // State to manage layer visibility
  const [coordinatesData, setCoordinatesData] = useState(null); // State to store fetched coordinates

  const pruneClusterRef = useRef(null); // Reference to store the PruneCluster instance

  // Ref to store the latest value of savedLocations
  const savedLocationsRef = useRef(savedLocations);

  // Update the ref whenever savedLocations changes
  useEffect(() => {
    savedLocationsRef.current = savedLocations;
  }, [savedLocations]);

  useEffect(() => {
    pruneClusterRef.current = new PruneClusterForLeaflet();

    const initializeMap = async () => {
      try {
        setLoading(true);
        const coordinates = await getCoordinates();
        console.log(coordinates);
        setCoordinatesData(coordinates); // Store the fetched coordinates data

        if (coordinates) {
          coordinates.forEach((coordinate) => {
            const marker = new PruneCluster.Marker(coordinate.y, coordinate.x, {
              title: "title",
              tooltip: coordinate.rack_type,
            });

            let imageSource;
            if (coordinate.rack_type && getImageSource(coordinate.rack_type)) {
              imageSource = `<img class="rounded-md shadow" height=${imageSize} width=${imageSize} src="${getImageSource(
                coordinate.rack_type
              )}" alt="${coordinate.rack_type}"></img>`;
            } else if (coordinate.type === "sign") {
              imageSource = `<img class="rounded-md shadow" height=${imageSize} width=${imageSize} src="/images/streetsign.jpg" alt="street sign"></img>`;
            } else {
              imageSource = `<div class="flex flex-col w-full items-center bg-slate-200 border-[1px] border-slate-300 rounded-lg p-3">${NoImageSVG}<p class="!p-0 !m-0 text-xs">No image available</p></div>`;
            }

            marker.data.popup = `
              <div class="flex flex-col">
                <p class="!m-0 !p-0 text-base font-extrabold font-sans">${
                  coordinate.rack_type ? coordinate.rack_type : "Street Sign"
                }</p>
                ${
                  coordinate.type === "sign"
                    ? `<div class="relative"><div class="my-1 flex justify-center items-center select-none">${imageSource}</div><div class="absolute bottom-0 my-1 flex justify-center items-center bg-black/85 w-full h-[94%] px-1 rounded-md opacity-0 hover:opacity-100 duration-500 ease-in-out transition-all overflow-auto"><p class="text-xs text-white font-mono">${coordinate.sign_description}</p></div></div>`
                    : `<div class="my-1 flex justify-center items-center select-none pointer-events-none">${imageSource}</div>`
                }
                <p class="text-center ${
                  coordinate.type === "rack"
                    ? "text-base overflow-x-auto"
                    : "max-w-[170px] text-sm tracking-tight"
                } hover:underline !p-0 !m-0"><a href="https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${
              coordinate.y
            },${coordinate.x}" target="_blank" class="!text-black">${
              coordinate.type === "userAdded"
                ? "Open in Google Maps"
                : coordinate.address
            }</a></p>
                <div class="flex flex-col gap-2 mt-1 mb-3">
                  <button id="save-location-${
                    coordinate.id
                  }" title="Save Location" aria-label="Save Location" aria-disabled="false" class="save-location-btn flex text-sm font-bold justify-center items-center w-full border-[1px] rounded-3xl border-slate-300 bg-slate-200 hover:bg-slate-300">
                    ${
                      savedLocationsRef.current.includes(coordinate.id)
                        ? `${SavedBookmarkSVG} Saved`
                        : `${BookmarkSVG} Save`
                    }
                  </button>
                  <button id="get-directions-${
                    coordinate.id
                  }" title="Directions" aria-label="Directions" class="get-directions-btn flex text-sm font-bold justify-center items-center w-full border-[1px] rounded-3xl border-blue-600 hover:shadow-lg gap-1 text-white bg-blue-600">
                    ${DirectionsSVG} Directions
                  </button>
                </div>
                ${
                  coordinate.type === "rack"
                    ? `<div class="popup dateInst"><i>Date Installed: ${formatDate(
                        coordinate.date_inst
                      )}</i></div>`
                    : coordinate.type === "userAdded"
                    ? `<div class="flex justify-between items-end"><p class="date_installed popup dateInst">Added by: <span class="font-bold">${coordinate.author}</span>, ${coordinate.date_added}</p></div>`
                    : null
                }
              </div>
            `;

            pruneClusterRef.current.RegisterMarker(marker);
          });

          if (showLayer) {
            map.addLayer(pruneClusterRef.current);
          }

          map.on("popupopen", async (e) => {
            const popup = e.popup;
            popup.options.autoPan = false;
            const saveLocationBtn =
              popup._contentNode.querySelector(".save-location-btn");
            const directionsBtn = popup._contentNode.querySelector(
              ".get-directions-btn"
            );

            if (directionsBtn) {
              const coordinateId = directionsBtn.id.split("-").pop();
              const coordinate = coordinates.find(
                (c) => c.id.toString() === coordinateId
              );
              if (coordinate) {
                directionsBtn.addEventListener("click", () =>
                  handleGetDirections(coordinate)
                );
              }
            }

            if (saveLocationBtn) {
              const coordinateId = saveLocationBtn.id.split("-").pop();
              const coordinate = coordinates.find(
                (c) => c.id.toString() === coordinateId
              );
              if (coordinate) {
                const isSaved = savedLocationsRef.current.includes(
                  coordinate.id
                );
                saveLocationBtn.innerHTML = `${
                  isSaved ? `${SavedBookmarkSVG} Saved` : `${BookmarkSVG} Save`
                }`;
                saveLocationBtn.addEventListener("click", () =>
                  handleSaveLocation(coordinate, saveLocationBtn)
                );
              }
            }
          });
        }
      } catch (error) {
        console.error("Failed to fetch coordinates data:", error);
      }
      setLoading(false);
    };

    initializeMap();

    const handleMoveEnd = () => {
      savedLocationsRef.current = savedLocations;
    };

    map.on("moveend", handleMoveEnd);

    // Cleanup event listener on component unmount
    return () => {
      map.off("moveend", handleMoveEnd);
    };
  }, [map]);

  const handleGetDirections = (coordinate) => {
    setRouteCoordinates({ x: coordinate.x, y: coordinate.y });
  };

  const handleSaveLocation = (coordinate, saveLocationBtn) => {
    setSavedLocations((prevSavedLocations) => {
      if (prevSavedLocations.includes(coordinate.id)) {
        saveLocationBtn.innerHTML = `${BookmarkSVG} Save`;
        return prevSavedLocations.filter(
          (savedLocation) => savedLocation !== coordinate.id
        );
      } else {
        saveLocationBtn.innerHTML = `${SavedBookmarkSVG} Saved`;
        return [...prevSavedLocations, coordinate.id];
      }
    });
  };

  const toggleLayer = () => {
    if (showLayer) {
      pruneClusterRef.current.RemoveMarkers(); // Clear the markers using PruneCluster's method
      pruneClusterRef.current.ProcessView();
    } else {
      if (coordinatesData) {
        coordinatesData.forEach((coordinate) => {
          const marker = new PruneCluster.Marker(coordinate.y, coordinate.x, {
            title: "title",
            tooltip: coordinate.rack_type,
          });

          let imageSource;
          if (coordinate.rack_type && getImageSource(coordinate.rack_type)) {
            imageSource = `<img class="rounded-md shadow" height=${imageSize} width=${imageSize} src="${getImageSource(
              coordinate.rack_type
            )}" alt="${coordinate.rack_type}"></img>`;
          } else if (coordinate.type === "sign") {
            imageSource = `<img class="rounded-md shadow" height=${imageSize} width=${imageSize} src="/images/streetsign.jpg" alt="street sign"></img>`;
          } else {
            imageSource = `<div class="flex flex-col w-full items-center bg-slate-200 border-[1px] border-slate-300 rounded-lg p-3">${NoImageSVG}<p class="!p-0 !m-0 text-xs">No image available</p></div>`;
          }

          marker.data.popup = `
            <div class="flex flex-col">
              <p class="!m-0 !p-0 text-base font-extrabold font-sans">${
                coordinate.rack_type ? coordinate.rack_type : "Street Sign"
              }</p>
              ${
                coordinate.type === "sign"
                  ? `<div class="relative"><div class="my-1 flex justify-center items-center select-none">${imageSource}</div><div class="absolute bottom-0 my-1 flex justify-center items-center bg-black/85 w-full h-[94%] px-1 rounded-md opacity-0 hover:opacity-100 duration-500 ease-in-out transition-all overflow-auto"><p class="text-xs text-white font-mono">${coordinate.sign_description}</p></div></div>`
                  : `<div class="my-1 flex justify-center items-center select-none pointer-events-none">${imageSource}</div>`
              }
              <p class="text-center ${
                coordinate.type === "rack"
                  ? "text-base overflow-x-auto"
                  : "max-w-[170px] text-sm tracking-tight"
              } hover:underline !p-0 !m-0"><a href="https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${
            coordinate.y
          },${coordinate.x}" target="_blank" class="!text-black">${
            coordinate.type === "userAdded"
              ? "Open in Google Maps"
              : coordinate.address
          }</a></p>
              <div class="flex flex-col gap-2 mt-1 mb-3">
                <button id="save-location-${
                  coordinate.id
                }" title="Save Location" aria-label="Save Location" aria-disabled="false" class="save-location-btn flex text-sm font-bold justify-center items-center w-full border-[1px] rounded-3xl border-slate-300 bg-slate-200 hover:bg-slate-300">
                  ${
                    savedLocationsRef.current.includes(coordinate.id)
                      ? `${SavedBookmarkSVG} Saved`
                      : `${BookmarkSVG} Save`
                  }
                </button>
                <button id="get-directions-${
                  coordinate.id
                }" title="Directions" aria-label="Directions" class="get-directions-btn flex text-sm font-bold justify-center items-center w-full border-[1px] rounded-3xl border-blue-600 hover:shadow-lg gap-1 text-white bg-blue-600">
                  ${DirectionsSVG} Directions
                </button>
              </div>
                ${
                  coordinate.type === "rack"
                    ? `<div class="popup dateInst"><i>Date Installed: ${formatDate(
                        coordinate.date_inst
                      )}</i></div>`
                    : coordinate.type === "userAdded"
                    ? `<div class="flex justify-between items-end"><p class="date_installed popup dateInst">Added by: <span class="font-bold">${coordinate.author}</span>, ${coordinate.date_added}</p></div>`
                    : null
                }
            </div>
          `;

          pruneClusterRef.current.RegisterMarker(marker);
        });
        pruneClusterRef.current.ProcessView(); // Reprocess the view to show the markers again
      }
    }
    setShowLayer((prevShowLayer) => !prevShowLayer); // Toggle the layer visibility state
  };

  return (
    <div>
      {loading && <Loader />}
      {routeCoordinates && (
        <RouteLayer map={map} coordinates={routeCoordinates} />
      )}
      <button className="layer-control-buttons" onClick={toggleLayer}>
        {showLayer ? "Clear Layers" : "Show Layers"}
      </button>
    </div>
  );
};

export default PruneMarkerClusterLayer;

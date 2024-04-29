// "use client";
// import { useEffect, useState } from "react";
// import MarkerClusterGroup from "react-leaflet-cluster";
// import Loader from "@/components/Loader";
// import { createSupabaseBrowserClient } from "@/utils/supabase/browser-client";
// import useSession from "@/utils/supabase/use-session";
// import getBikeRackCoords from "@/lib/getBikeRackCoords";
// import NewMarker from "../NewMarker";

// const BikeRackLayer = () => {
//   const [markers, setMarkers] = useState<MarkerData[] | null>([]);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [favoriteMarkers, setFavoriteMarkers] = useState<string[]>([]);

//   const supabase = createSupabaseBrowserClient();
//   const session = useSession();
//   const uuid = session?.user.id;

//   useEffect(() => {
//     if (typeof window !== "undefined") {
//       const fetchData = async () => {
//         setLoading(true);
//         try {
//           const data = await getBikeRackCoords();
//           setMarkers(data);
//         } catch (error) {
//           console.error(error);
//         }
//         setLoading(false);
//       };
//       fetchData();
//     }
//   }, []);

//   const fetchFavoriteLocations = async () => {
//     try {
//       const response = await supabase
//         .from("Favorites")
//         .select("location_id")
//         .eq("user_id", uuid);
//       if (response.data) {
//         let favoriteLocations: string[] = response.data.map(
//           (favorite) => favorite.location_id
//         );
//         setFavoriteMarkers(favoriteLocations);
//       }
//     } catch (error) {
//       console.error("Error fetching favorite locations:", error);
//     }
//   };

//   // Call fetchFavoriteLocations when user is authenticated
//   useEffect(() => {
//     if (uuid) {
//       fetchFavoriteLocations();
//     }
//   }, [uuid]);

//   return (
//     <>
//       {loading && <Loader />}
//       {!loading && (
//         <>
//           <MarkerClusterGroup
//             chunkedLoading={true}
//             maxClusterRadius={160}
//             removeOutsideVisibleBounds={true}
//           >
//             {markers?.map((marker, index) => (
//               <NewMarker
//                 key={index}
//                 marker={marker}
//                 favoriteLocations={favoriteMarkers}
//               />
//             ))}
//           </MarkerClusterGroup>
//         </>
//       )}
//     </>
//   );
// };

// export default BikeRackLayer;

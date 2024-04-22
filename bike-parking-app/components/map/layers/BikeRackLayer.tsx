"use client";

import getCoordinates from "@/lib/getCoordinates";
import { useCallback, useEffect, useState } from "react";
import { LayerGroup, LayersControl, Marker } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import Loader from "@/components/Loader";
import { rackIcon } from "@/components/Icons";
import MyMarker from "../MyMarker";
import toast, { Toaster } from "react-hot-toast";
import queryString from "query-string";
import { debounce } from "@/hooks/useDebounce";
import { createSupabaseBrowserClient } from "@/utils/supabase/browser-client";
import useSession from "@/utils/supabase/use-session";
import axios from "axios";
import { useParams } from "next/navigation";
import getBikeRackCoords from "@/lib/getBikeRackCoords";

const BikeRackLayer = () => {
  const [markers, setMarkers] = useState<MarkerData[] | null>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [favoriteMarkers, setFavoriteMarkers] = useState<string[]>([]);
  const [progress, setProgress] = useState<number>(0);

  const supabase = createSupabaseBrowserClient();
  const session = useSession();
  const username = session?.user.user_metadata.username;
  const uuid = session?.user.id;

  const params = useParams();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const fetchData = async () => {
        setLoading(true);
        try {
          const data = await getBikeRackCoords();
          setMarkers(data);
        } catch (error) {
          console.error(error);
        }
        setLoading(false);
      };
      fetchData();
    }
  }, []);

  const chunkProgressHandler = (
    processedMarkers: number,
    totalMarkers: number,
    elapsedTime: number
  ) => {
    const percentage = Math.round((processedMarkers / totalMarkers) * 100);
    setProgress(percentage);
    console.log(percentage);
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
        // console.log(favoriteLocations, favoriteMarkers);
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
    return favoriteMarkers.includes(marker.id || "");
  };

  const handleSaveFavorite = useCallback(
    (marker: MarkerData) => {
      const username = session?.user.user_metadata.username;
      const uuid = session?.user.id;

      if (!uuid) {
        toast.error("Sign in to favorite locations!", {
          id: "signInToFavoriteLocationsError",
        });
        return;
      }

      const updateFavorites = debounce(async () => {
        try {
          let values = {};
          if (!favoriteMarkers.includes(marker.id || "")) {
            // Check if the marker is already a favorite
            // if not, add it to the list of favoriteMarkers
            setFavoriteMarkers((prevMarkers) => [
              ...prevMarkers,
              marker.id || "",
            ]);
            values = {
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
            marker.favorite = true;
          } else {
            // Remove the marker from the list of favoriteMarkers
            setFavoriteMarkers((prevMarkers) =>
              prevMarkers.filter((id) => id !== marker.id)
            );
            const { data, error } = await supabase
              .from("Favorites")
              .delete()
              .eq("user_id", uuid)
              .eq("location_id", marker.id);
            if (error) {
              console.log(`Error removing spot from favortes: ${error}`);
            }
            marker.favorite = false;
          }
        } catch (error) {
          console.error("Something went wrong:", error);
        }
      }, 300); // Debounce for x milliseconds (100ms = 1s)

      // Call the debounced function to update favorites
      updateFavorites();
    },
    [favoriteMarkers]
  );

  return (
    <>
      {loading && <Loader />}
      {/* <p className="z-[999] text-center">Progress: {progress}%</p> */}
      {!loading && (
        <>
          <LayersControl.Overlay name="Bike Racks" checked>
            <LayerGroup>
              <MarkerClusterGroup
                chunkedLoading={true}
                maxClusterRadius={160}
                removeOutsideVisibleBounds={true}
                // chunkProgress={chunkProgressHandler}
              >
                {markers?.map((marker, index) => (
                  <MyMarker
                    key={marker.id}
                    marker={marker}
                    isFavoriteMarker={isFavoriteMarker}
                    handleSaveFavorite={handleSaveFavorite}
                  />
                ))}
              </MarkerClusterGroup>
            </LayerGroup>
          </LayersControl.Overlay>
        </>
      )}
    </>
  );
};

export default BikeRackLayer;

"use client";

import getCoordinates from "@/lib/getCoordinates";
import { useCallback, useEffect, useMemo, useState } from "react";
import { LayerGroup, LayersControl, Marker, useMapEvent } from "react-leaflet";
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
import NewMarker from "../NewMarker";
import { LatLngBounds } from "leaflet";

const MarkerLayer = () => {
  const [markers, setMarkers] = useState<MarkerData[] | null>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [favoriteMarkers, setFavoriteMarkers] = useState<string[]>([]);

  const supabase = createSupabaseBrowserClient();
  const session = useSession();
  const username = session?.user.user_metadata.username;
  const uuid = session?.user.id;

  const params = useParams();

  const sampleMapBounds = new LatLngBounds(
    [40.75440932883489, -73.88889312744142], // SouthWest
    [40.7958778790764, -73.72409820556642] // NorthEast
  );

  // const map = useMapEvent("moveend", () => {
  //   const mapBounds = map.getBounds();
  //   console.log(mapBounds);
  // });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const fetchData = async () => {
        setLoading(true);
        try {
          const data = await getCoordinates();
          setMarkers(data);
        } catch (error) {
          console.error(error);
        }
        setLoading(false);
      };
      fetchData();
    }
  }, []);

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

  return (
    <>
      {loading && <Loader />}
      {!loading && (
        <>
          <LayersControl.Overlay name="Markers" checked>
            <LayerGroup>
              <MarkerClusterGroup
                chunkedLoading={true}
                maxClusterRadius={160}
                removeOutsideVisibleBounds={true}
              >
                {markers?.map((marker, index) => (
                  <NewMarker
                    key={index}
                    marker={marker}
                    favoriteLocations={favoriteMarkers}
                    supabase={supabase}
                    session={session}
                    username={username}
                    uuid={uuid}
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

export default MarkerLayer;

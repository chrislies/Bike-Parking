"use client";

import getCoordinates from "@/lib/getCoordinates";
import { useEffect, useState } from "react";
import { LayerGroup, LayersControl, useMapEvents } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import Loader from "@/components/Loader";
import { queryIcon, transparentIcon } from "@/components/Icons";
import toast from "react-hot-toast";
import { createSupabaseBrowserClient } from "@/utils/supabase/browser-client";
import useSession from "@/utils/supabase/use-session";
import MyMarker from "../MyMarker";
import L from "leaflet";
import "leaflet-routing-machine";

const MarkerLayer = () => {
  const [markers, setMarkers] = useState<MarkerData[] | null>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [favoriteMarkers, setFavoriteMarkers] = useState<string[]>([]);
  const [isCalculatingRoute, setIsCalculatingRoute] = useState(false);
  const [routingControl, setRoutingControl] =
    useState<L.Routing.Control | null>(null);

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

  const map = useMapEvents({});

  const handleGetDirections = (marker: MarkerData) => {
    if (navigator.geolocation) {
      setIsCalculatingRoute(true); // Disable the 'Directions' button
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;

          if (routingControl) {
            routingControl.getPlan().setWaypoints([]);
            map.removeControl(routingControl);
          }

          const newRoutingControl: any = L.Routing.control({
            waypoints: [
              L.latLng(latitude, longitude),
              L.latLng(marker.y!, marker.x!),
            ],
            router: L.Routing.osrmv1({
              serviceUrl:
                "https://routing.openstreetmap.de/routed-bike/route/v1",
              profile: "bike",
            }),
            lineOptions: {
              styles: [{ color: "#757de8", weight: 4 }],
            },
            collapsible: true,
            addWaypoints: false,
            routeWhileDragging: true,
            draggableWaypoints: true,
            createMarker: function (i, waypoint, n) {
              let icon = i === 0 ? transparentIcon : queryIcon;
              return L.marker(waypoint.latLng, {
                draggable: i === 1,
                icon: icon,
              });
            },
          }).addTo(map);

          newRoutingControl.on("routesfound", (e: any) => {
            setIsCalculatingRoute(false);
          });

          newRoutingControl.on("routingerror", (e: any) => {
            setIsCalculatingRoute(false);
            toast.error("Error calculating route.");
          });

          setRoutingControl(newRoutingControl);
        },
        (error) => {
          toast.error(`Error getting current location: ${error.message}`);
          setIsCalculatingRoute(false);
        }
      );
    } else {
      toast.error("Geolocation is not supported by this browser.");
      setIsCalculatingRoute(false);
    }
  };

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
                  <MyMarker
                    key={index}
                    marker={marker}
                    favoriteLocations={favoriteMarkers}
                    supabase={supabase}
                    session={session}
                    username={username}
                    uuid={uuid}
                    handleGetDirections={handleGetDirections}
                    isCalculatingRoute={isCalculatingRoute}
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

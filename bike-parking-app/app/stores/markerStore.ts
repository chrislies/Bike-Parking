import { create } from "zustand";
import L from "leaflet";
import "leaflet-routing-machine";
import {
  BaseSavedLocation,
  SavedLocation,
  useSavedLocationsStore,
} from "./savedLocationsStore";
import toast from "react-hot-toast";
import { transparentIcon } from "@/components/Icons";
import { MAP_ICONS } from "@/constants/mapIcons";

interface MarkerState {
  selectedMarkerId: string | null;
  isCalculatingRoute: boolean;
  routingControl: L.Routing.Control | null;
  setSelectedMarker: (id: string | null) => void;
  toggleSavedLocation: (location: BaseSavedLocation) => Promise<void>;
  calculateRoute: (
    marker: { x: number; y: number },
    map: L.Map
  ) => Promise<void>;
  clearRoute: (map: L.Map) => void;
}

declare module "leaflet" {
  namespace Routing {
    interface Control {
      on(event: "routesfound" | "routingerror", fn: () => void): this;
    }
  }
}

export const useMarkerStore = create<MarkerState>((set, get) => ({
  selectedMarkerId: null,
  isCalculatingRoute: false,
  routingControl: null,

  setSelectedMarker: (id) => set({ selectedMarkerId: id }),

  toggleSavedLocation: async (location) => {
    if (!location.user_id) {
      toast.error("Please sign in to save locations", {
        id: "signInToSave",
      });
      return;
    }

    const { locations, addLocation, removeLocation } =
      useSavedLocationsStore.getState();
    const isSaved = locations.some(
      (loc) => loc.location_id === location.location_id
    );

    try {
      if (isSaved) {
        await removeLocation(location.location_id, location.user_id);
        toast.success("Location unsaved", { id: "locationUnsaved" });
      } else {
        await addLocation(location);
        toast.success("Location saved", { id: "locationUnsaved" });
      }
      // No need to fetch locations again, state is updated in savedLocationsStore
    } catch (error) {
      toast.error("Error saving location", { id: "errorSavingLocation" });
    }
  },

  calculateRoute: async (marker, map) => {
    set({ isCalculatingRoute: true });

    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser", {
        id: "geolocationNotSupported",
      });
      set({ isCalculatingRoute: false });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const { routingControl } = get();

        // Clear existing route
        if (routingControl) {
          routingControl.getPlan().setWaypoints([]);
          map.removeControl(routingControl);
        }

        const newRoutingControl = L.Routing.control({
          waypoints: [
            L.latLng(latitude, longitude),
            L.latLng(marker.y, marker.x),
          ],
          router: L.Routing.osrmv1({
            serviceUrl: "https://routing.openstreetmap.de/routed-bike/route/v1",
            profile: "bike",
          }),
          lineOptions: {
            styles: [{ color: "#0f53ff", weight: 4 }],
          },
          collapsible: true,
          addWaypoints: false,
          routeWhileDragging: true,
          draggableWaypoints: true,
          createMarker: function (i, waypoint, n) {
            let icon = i === 0 ? transparentIcon : MAP_ICONS.queryIcon;
            return L.marker(waypoint.latLng, {
              draggable: i === 1,
              icon: icon,
            });
          },
        }).addTo(map);
        newRoutingControl.on("routesfound", () => {
          set({ isCalculatingRoute: false });
        });

        newRoutingControl.on("routingerror", () => {
          set({ isCalculatingRoute: false });
          toast.error("Error calculating route", {
            id: "errorCalculatingRoute",
          });
        });

        set({ routingControl: newRoutingControl });
      },
      (error) => {
        toast.error(`Error getting location: ${error.message}`, {
          id: "errorGettingLocation",
        });
        set({ isCalculatingRoute: false });
      }
    );
  },

  clearRoute: (map) => {
    const { routingControl } = get();
    if (routingControl) {
      routingControl.getPlan().setWaypoints([]);
      map.removeControl(routingControl);
      set({ routingControl: null });
    }
  },
}));

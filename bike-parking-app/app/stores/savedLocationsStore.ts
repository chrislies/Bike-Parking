import { create } from "zustand";
import { createSupabaseBrowserClient } from "@/utils/supabase/browser-client";
import { SupabaseClient } from "@supabase/supabase-js";

export interface BaseSavedLocation {
  user_id: string;
  location_id: string;
  x_coord: number;
  y_coord: number;
  location_address: string;
}

export interface SavedLocation extends BaseSavedLocation {
  id: number;
}

interface SavedLocationsStore {
  supabase: SupabaseClient;
  locations: SavedLocation[];
  isLoading: boolean;
  fetchLocations: (userId: string) => Promise<void>;
  addLocation: (location: BaseSavedLocation) => Promise<void>;
  removeLocation: (locationId: string, userId: string) => Promise<void>;
}

export const useSavedLocationsStore = create<SavedLocationsStore>(
  (set, get) => {
    const supabase = createSupabaseBrowserClient();

    return {
      supabase,
      locations: [],
      isLoading: false,

      fetchLocations: async (userId) => {
        set({ isLoading: true });
        const { data, error } = await get()
          .supabase.from("Favorites")
          .select()
          .eq("user_id", userId);

        if (!error && data) {
          set({ locations: data as SavedLocation[] });
        }
        set({ isLoading: false });
      },

      addLocation: async (location) => {
        const { data, error } = await get()
          .supabase.from("Favorites")
          .insert(location)
          .select()
          .single();

        if (!error && data) {
          set((state) => ({
            locations: [...state.locations, data as SavedLocation],
          }));
        }
      },

      removeLocation: async (locationId, userId) => {
        const { error } = await get()
          .supabase.from("Favorites")
          .delete()
          .eq("location_id", locationId)
          .eq("user_id", userId);

        if (!error) {
          set((state) => ({
            locations: state.locations.filter(
              (loc) => loc.location_id !== locationId
            ),
          }));
        }
      },
    };
  }
);

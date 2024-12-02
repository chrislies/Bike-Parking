import { create } from "zustand";
import { createSupabaseBrowserClient } from "@/utils/supabase/browser-client";
import { SupabaseClient } from "@supabase/supabase-js";

export interface UserRequest {
  user_id: string;
  username: string;
  email: string;
  created_at: string;
  id: number;
  request_type: string;
  description: string;
  image: string;
  x_coord: number;
  y_coord: number;
}

interface UserRequestsStore {
  supabase: SupabaseClient;
  requests: UserRequest[];
  isLoading: boolean;
  hasFetched: boolean;
  fetchUserRequests: (userId: string, username: string) => Promise<void>;
  removeUserRequest: (requestId: number) => Promise<void>;
}

export const useUserRequestsStore = create<UserRequestsStore>((set, get) => {
  const supabase = createSupabaseBrowserClient();

  return {
    supabase,
    requests: [],
    isLoading: false,
    hasFetched: false,

    fetchUserRequests: async (userId, username) => {
      // Skip fetching if already fetched
      if (get().hasFetched) return;

      set({ isLoading: true });

      try {
        const { data, error } = await supabase
          .from("Pending")
          .select("*")
          .or(`user_id.eq.${userId},and(user_id.is.null,username.eq.${username})`)
          .order("created_at", { ascending: false });

        if (error) {
          throw new Error(`Failed to fetch requests: ${error.message}`);
        }
        set({ requests: data || [], isLoading: false, hasFetched: true });
      } catch (error) {
        console.error("Error fetching user requests:", error);
        set({ requests: [], isLoading: false });
      }
    },

    removeUserRequest: async (requestId: number) => {
      const { error } = await supabase.from("Pending").delete().eq("id", requestId);

      if (error) {
        console.error("Error removing request:", error);
      } else {
        set((state) => ({
          requests: state.requests.filter((request) => request.id !== requestId),
        }));
      }
    },
  };
});

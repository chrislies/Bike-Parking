import { create } from "zustand";
import { createSupabaseBrowserClient } from "@/utils/supabase/browser-client";
import { Session } from "@supabase/supabase-js";
import { useSavedLocationsStore } from "./savedLocationsStore";

interface UserStore {
  supabase: ReturnType<typeof createSupabaseBrowserClient>;
  session: Session | null;
  username: string | null;
  uuid: string | null;
  email: string | null;
  isAdmin: boolean;
  isInitialized: boolean;
  setSession: (session: Session | null) => void;
  initialize: () => Promise<void>;
  signOut: () => Promise<void>;
}

export const useUserStore = create<UserStore>((set, get) => {
  // Create single Supabase instance
  const supabase = createSupabaseBrowserClient();

  // Subscribe to auth changes immediately
  supabase.auth.onAuthStateChange((event, session) => {
    set({
      session,
      username: session?.user?.user_metadata?.username || null,
      uuid: session?.user?.id || null,
      email: session?.user?.email || null,
    });

    // Fetch locations when auth state changes
    if (session?.user?.id) {
      useSavedLocationsStore.getState().fetchLocations(session.user.id);
    }
  });

  return {
    supabase,
    session: null,
    username: null,
    uuid: null,
    email: null,
    isAdmin: false,
    isInitialized: false,

    setSession: (session) =>
      set({
        session,
        username: session?.user?.user_metadata?.username || null,
        uuid: session?.user?.id || null,
        email: session?.user?.email || null,
      }),

    initialize: async () => {
      // Only initialize once
      if (get().isInitialized) return;

      const {
        data: { session },
      } = await get().supabase.auth.getSession();

      if (session) {
        const { data } = await get()
          .supabase.from("admins")
          .select()
          .eq("id", session.user.id)
          .single();

        set({
          session,
          username: session.user.user_metadata.username,
          uuid: session.user.id,
          email: session.user.email,
          isAdmin: !!data,
          isInitialized: true,
        });

        // Fetch saved locations after session is confirmed
        await useSavedLocationsStore.getState().fetchLocations(session.user.id);
      }
    },

    signOut: async () => {
      await get().supabase.auth.signOut();
      set({
        session: null,
        username: null,
        uuid: null,
        email: null,
        isAdmin: false,
      });
    },
  };
});

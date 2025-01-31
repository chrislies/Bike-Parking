import { create } from "zustand";
import { createSupabaseBrowserClient } from "@/utils/supabase/browser-client";
import { SupabaseClient } from "@supabase/supabase-js";

export interface UserReport {
  id?: number;
  user_id: string;
  username: string;
  location_id: string;
  option: string;
  description: string;
  created_at: string;
  x: number;
  y: number;
}

interface UserReportsStore {
  supabase: SupabaseClient;
  reports: UserReport[];
  isLoading: boolean;
  hasFetched: boolean;
  fetchUserReports: (userId: string, username: string) => Promise<void>;
  addUserReport: (report: UserReport) => void;
  removeUserReport: (reportId: number) => Promise<void>;
}

export const useUserReportsStore = create<UserReportsStore>((set, get) => {
  const supabase = createSupabaseBrowserClient();

  return {
    supabase,
    reports: [],
    isLoading: false,
    hasFetched: false,

    fetchUserReports: async (userId, username) => {
      // Skip fetching if already fetched
      if (get().hasFetched) return;

      set({ isLoading: true });

      try {
        const { data, error } = await supabase
          .from("Report")
          .select("*")
          .or(`user_id.eq.${userId},and(user_id.is.null,username.eq.${username})`)
          .order("created_at", { ascending: false });

        if (error) {
          throw new Error(`Failed to fetch reports: ${error.message}`);
        }
        set({ reports: data || [], isLoading: false, hasFetched: true });
      } catch (error) {
        console.error("Error fetching user reports:", error);
        set({ reports: [], isLoading: false });
      }
    },

    addUserReport: async (report: UserReport) => {
      const { data, error } = await get().supabase.from("Report").insert(report).select().single();
      if (!error && data) {
        set((state) => ({
          reports: [data, ...state.reports],
        }));
      }
    },

    removeUserReport: async (reportId: number) => {
      const { error } = await supabase.from("Report").delete().eq("id", reportId);

      if (error) {
        console.error("Error removing report:", error);
      } else {
        set((state) => ({
          reports: state.reports.filter((report) => report.id !== reportId),
        }));
      }
    },
  };
});

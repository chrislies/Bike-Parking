import { create } from "zustand";
import { createSupabaseBrowserClient } from "@/utils/supabase/browser-client";

interface Report {
  option: string;
  description: string;
  username: string;
  created_at: string;
}

interface ReportsState {
  reports: Record<string, Report[]>;
  isLoading: Record<string, boolean>;
  fetchReports: (spotId: string, x?: number, y?: number) => Promise<void>;
  addReport: (spotId: string, report: Report) => void;
}

export const useReportsStore = create<ReportsState>((set, get) => {
  const supabase = createSupabaseBrowserClient();

  return {
    reports: {},
    isLoading: {},

    fetchReports: async (spotId, x, y) => {
      // Don't skip if already loaded; we want fresh data
      set((state) => ({
        isLoading: { ...state.isLoading, [spotId]: true },
      }));

      try {
        const query = spotId
          ? supabase
              .from("Report")
              .select("created_at, username, option, description")
              .eq("location_id", spotId)
          : supabase
              .from("Report")
              .select("created_at, username, option, description")
              .eq("x", x)
              .eq("y", y);

        const { data, error } = await query.order("created_at", { ascending: false });

        if (error) throw error;

        set((state) => ({
          reports: { ...state.reports, [spotId]: data || [] },
          isLoading: { ...state.isLoading, [spotId]: false },
        }));
      } catch (error) {
        console.error("Error fetching reports:", error);
        set((state) => ({
          reports: { ...state.reports, [spotId]: [] },
          isLoading: { ...state.isLoading, [spotId]: false },
        }));
      }
    },

    addReport: (spotId, report) => {
      set((state) => ({
        reports: {
          ...state.reports,
          [spotId]: [report, ...(state.reports[spotId] || [])],
        },
      }));
    },
  };
});

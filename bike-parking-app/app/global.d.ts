import { Database as DB } from "@/lib/database.types";

declare global {
  type Database = DB;

  interface MarkerData {
    x?: number;
    y?: number;
    id?: string;
    address?: string;
    rack_type?: string;
    date_inst?: string;
    sign_description?: string;
    sign_code?: string;
    favorite: boolean;
    type: string;
    author?: string;
    date_added?: string;
  }

  interface UserAddedMarkerData {
    id: number;
    site_id: string;
    created_at: string;
    email: string;
    username: string;
    x_coord: number;
    y_coord: number;
    selectedOption: string;
  }

  interface UserCoordinatesItem {
    longitude: number;
    latitude: number;
  }
}

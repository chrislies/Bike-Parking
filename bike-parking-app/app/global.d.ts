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
  }

  interface UserCoordinatesItem {
    longitude: number;
    latitude: number;
  }
}

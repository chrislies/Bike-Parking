import { MapOptions } from "leaflet";

declare module "leaflet" {
  interface MapOptions {
    rotateControl?: boolean | { closeOnZeroBearing: boolean };
  }
}

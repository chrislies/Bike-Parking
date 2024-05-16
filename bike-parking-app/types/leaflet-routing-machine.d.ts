import * as L from "leaflet";

declare module "leaflet" {
  namespace Routing {
    function control(options: ControlOptions): Control;
    function osrmv1(options: OSRMOptions): OSRM;

    interface ControlOptions {
      waypoints?: L.LatLng[];
      lineOptions?: { styles: { color: string; weight: number }[] };
      show?: boolean;
      addWaypoints?: boolean;
      routeWhileDragging?: boolean;
      draggableWaypoints?: boolean;
      fitSelectedRoutes?: boolean;
      showAlternatives?: boolean;
      createMarker?: (i: number, waypoint: Waypoint, n: number) => L.Marker;
      router?: OSRM;
      position?: string;
      collapsible?: boolean;
    }

    interface Control extends L.Control {
      getPlan(): Plan;
      getWaypoints(): L.LatLng[];
      setWaypoints(waypoints: L.LatLng[]): this;
    }

    interface Plan extends L.Evented {
      setWaypoints(waypoints: L.LatLng[]): this;
    }

    interface Waypoint {
      latLng: L.LatLng;
      name?: string;
      options?: { [key: string]: any };
    }

    interface OSRMOptions {
      serviceUrl?: string;
      profile?: string;
      timeout?: number;
    }

    interface OSRM {
      route(
        waypoints: Waypoint[],
        callback: (err: any, routes: any) => void
      ): void;
    }
  }

  function routing(): Routing.Control;
}

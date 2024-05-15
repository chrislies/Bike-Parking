import * as L from "leaflet";

declare module "leaflet" {
  namespace Routing {
    function control(options: ControlOptions): Control;

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
  }

  function routing(): Routing.Control;
}

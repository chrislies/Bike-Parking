// // Leaflet routing machine is used for navigational direction
import L from "leaflet";
import { createControlComponent } from "@react-leaflet/core";
import { Geocoder, geocoders } from "leaflet-control-geocoder";
import "leaflet-routing-machine";

const createRoutingMachineLayer = (props) => {
  const instance = L.Routing.control({
    waypoints: [
      L.latLng(33.52001088075479, 36.26829385757446),
      L.latLng(33.50546582848033, 36.29547681726967),
    ],
    lineOptions: {
      styles: [{ color: "#6FA1EC", weight: 4 }],
    },
    show: false,
    addWaypoints: false,
    routeWhileDragging: true,
    draggableWaypoints: true,
    fitSelectedRoutes: true,
    showAlternatives: false,
    // geocoder: L.Control.Geocoder.nominatim()
  });

  return instance;
};

const RoutingMachine = createControlComponent(createRoutingMachineLayer);

export default RoutingMachine;

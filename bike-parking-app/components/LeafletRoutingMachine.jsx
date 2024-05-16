import React, { useState } from "react";
import L from "leaflet";
import { createControlComponent } from "@react-leaflet/core";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import { queryIcon, transparentIcon } from "./Icons";
import toast from "react-hot-toast";

const RoutineMachineComponent = ({ end }) => {
  const [isCalculatingRoute, setIsCalculatingRoute] = useState(false);

  const createRoutineMachineLayer = () => {
    if (navigator.geolocation) {
      setIsCalculatingRoute(true); // Disable the 'Directions' button
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;

          const instance = L.Routing.control({
            waypoints: [L.latLng(latitude, longitude), end],
            router: L.Routing.osrmv1({
              serviceUrl:
                "https://routing.openstreetmap.de/routed-bike/route/v1",
              profile: "bike",
            }),
            lineOptions: {
              styles: [{ color: "#757de8", weight: 4 }],
            },
            addWaypoints: false,
            routeWhileDragging: true,
            draggableWaypoints: true,
            createMarker: function (i, waypoint, n) {
              let icon = i === 0 ? transparentIcon : queryIcon;
              return L.marker(waypoint.latLng, {
                draggable: i === 1,
                icon: icon,
              });
            },
          });

          setIsCalculatingRoute(false);
          return instance;
        },
        (error) => {
          console.error("Error getting user location:", error);
          toast.error("Error getting user location.");
          setIsCalculatingRoute(false);
        }
      );
    } else {
      toast.error("Geolocation is not supported by this browser.");
      setIsCalculatingRoute(false);
    }
  };

  return createRoutineMachineLayer();
};

const RoutingMachine = createControlComponent(RoutineMachineComponent);

export default RoutingMachine;

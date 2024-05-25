import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import toast from "react-hot-toast";
import { queryIcon, transparentIcon } from "@/components/Icons";

const RouteLayer = ({ map, coordinates }) => {
  const [isCalculatingRoute, setIsCalculatingRoute] = useState(true);
  const routingControlRef = useRef(null);

  useEffect(() => {
    console.log("Route Layer called");
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;

          // Remove existing routing control if it exists
          if (routingControlRef.current) {
            routingControlRef.current.remove();
          }

          const routingControl = L.Routing.control({
            waypoints: [
              L.latLng(latitude, longitude),
              L.latLng(coordinates.y, coordinates.x),
            ],
            router: L.Routing.osrmv1({
              serviceUrl:
                "https://routing.openstreetmap.de/routed-bike/route/v1",
              profile: "bike",
            }),
            lineOptions: {
              styles: [{ color: "#0f53ff", weight: 4 }],
            },
            collapsible: true,
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
          }).addTo(map);

          routingControl.on("routesfound", () => {
            setIsCalculatingRoute(false);
          });

          routingControl.on("routingerror", () => {
            setIsCalculatingRoute(false);
            toast.error("Error calculating route.");
          });

          // Save routing control reference
          routingControlRef.current = routingControl;
        },
        (error) => {
          toast.error(`Error getting current location: ${error.message}`);
          setIsCalculatingRoute(false);
        }
      );
    } else {
      toast.error("Geolocation is not supported by this browser.");
      setIsCalculatingRoute(false);
    }
  }, [coordinates, map]);

  return null; // RouteLayer does not render any DOM elements directly
};

export default RouteLayer;

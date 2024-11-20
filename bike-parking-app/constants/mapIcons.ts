import L from "leaflet";

export const MAP_ICONS = {
  rackIcon: new L.Icon({
    iconUrl: "/svgs/RackMarker.svg",
    iconSize: [45, 50],
    iconAnchor: [20, 30],
    popupAnchor: [3, -16],
  }),
  shelterIcon: new L.Icon({
    iconUrl: "/svgs/ShelterMarker.svg",
    iconSize: [45, 50],
    iconAnchor: [20, 30],
    popupAnchor: [3, -16],
  }),
  signIcon: new L.Icon({
    iconUrl: "/svgs/SignMarker.svg",
    iconSize: [45, 50],
    iconAnchor: [20, 30],
    popupAnchor: [3, -16],
  }),
  favoriteIcon: new L.Icon({
    iconUrl: "/svgs/FavoriteMarker.svg",
    iconSize: [45, 50],
    iconAnchor: [20, 30],
    popupAnchor: [3, -16],
  }),
  queryIcon: new L.Icon({
    iconUrl: "/svgs/SearchPin.svg",
    iconSize: [45, 50],
    iconAnchor: [20, 30],
    popupAnchor: [3, -16],
  }),
};

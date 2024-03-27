import L from "leaflet";

const iconUser = new L.Icon({
  iconUrl: require("../svgs/UserMarker.svg"),
  iconRetinaUrl: require("../svgs/UserMarker.svg"),
  iconAnchor: null,
  popupAnchor: null,
  shadowUrl: null,
  shadowSize: null,
  shadowAnchor: null,
  iconSize: new L.Point(60, 75),
  className: "leaflet-div-icon",
});

export { iconUser };

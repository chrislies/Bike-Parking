import L, {
  LatLng,
  map,
  divIcon,
  Icon,
  point,
  MarkerCluster,
  Point,
} from "leaflet";
import ReactDOMServer from "react-dom/server";
import {
  Bookmark,
  FavoriteMarker,
  Layers,
  Locate,
  RackMarker,
  UserMarker,
  SearchPin,
  TempMarker,
  SignMarker,
} from "./svgs";

const rackIcon = L.divIcon({
  className: "custom-icon",
  html: ReactDOMServer.renderToString(<RackMarker />),
  // iconSize: [10, 10],
  iconAnchor: [20, 30],
  popupAnchor: [3, -16],
});

const signIcon = L.divIcon({
  className: "custom-icon",
  html: ReactDOMServer.renderToString(<SignMarker />),
  // iconSize: [10, 10],
  iconAnchor: [20, 30],
  popupAnchor: [3, -16],
});

const favoriteIcon = L.divIcon({
  className: "favorite-icon",
  html: ReactDOMServer.renderToString(<FavoriteMarker />),
  // iconSize: [10, 10],
  iconAnchor: [20, 30],
  popupAnchor: [3, -16],
});

const queryIcon = L.divIcon({
  className: "query-icon",
  html: ReactDOMServer.renderToString(<SearchPin />),
  // iconSize: [10, 10],
  iconAnchor: [20, 30],
  popupAnchor: [3, -16],
});

const userIcon = L.divIcon({
  className: "user-icon",
  html: ReactDOMServer.renderToString(<UserMarker />),
  iconSize: [18, 18],
});

const tempIcon = L.divIcon({
  className: "temp-icon",
  html: ReactDOMServer.renderToString(<TempMarker />),
  iconAnchor: [22.5, 45],
  popupAnchor: [0, -45],
});

const createClusterCustomIcon = function (cluster: MarkerCluster) {
  return L.divIcon({
    html: `<span class="cluster-icon">${cluster.getChildCount()}</span>`,
    className: "custom-marker-cluster",
    iconSize: point(33, 33, true),
  });
};

export {
  rackIcon,
  signIcon,
  favoriteIcon,
  userIcon,
  queryIcon,
  tempIcon,
  createClusterCustomIcon,
};

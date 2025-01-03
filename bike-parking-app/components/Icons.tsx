import L, { point } from "leaflet";
import ReactDOMServer from "react-dom/server";
import {
  FavoriteMarker,
  RackMarker,
  UserMarker,
  SearchPin,
  TempMarker,
  SignMarker,
  TransparentMarker,
} from "./svgs";

const rackIcon = L.divIcon({
  className: "rack-icon",
  html: ReactDOMServer.renderToString(<RackMarker />),
  // iconSize: [10, 10],
  iconAnchor: [20, 30],
  popupAnchor: [3, -16],
});

const signIcon = L.divIcon({
  className: "sign-icon",
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

const transparentIcon = L.divIcon({
  className: "transparent-icon",
  html: ReactDOMServer.renderToString(<TransparentMarker />),
  iconAnchor: [22.5, 45],
  popupAnchor: [0, -45],
});

export {
  rackIcon,
  signIcon,
  favoriteIcon,
  userIcon,
  queryIcon,
  tempIcon,
  transparentIcon,
};

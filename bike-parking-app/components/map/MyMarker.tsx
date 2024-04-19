import { Icon } from "leaflet";
import { useCallback } from "react";
import { Marker, Popup, useMapEvents } from "react-leaflet";

const markerIcon = new Icon({
  iconUrl: "/images/rack_u-rack.jpg",
  iconSize: [40, 42],
  iconAnchor: [15, 42],
});

const MyMarker = ({
  x,
  y,
  id,
  address,
  rack_type,
  date_inst,
  sign_description,
  sign_code,
  favorite,
  type,
}: MarkerData) => {
  const map = useMapEvents({});

  const handleFlyTo = useCallback(() => {
    map.flyTo([y ?? 0, x ?? 0], 18, { animate: true, duration: 1.5 });
  }, []);
  return (
    <Marker
      position={[y ?? 0, x ?? 0]}
      icon={markerIcon}
      eventHandlers={{ click: handleFlyTo }}
    >
      <Popup>
        <h1>{id}</h1>
        <p>{type}</p>
      </Popup>
    </Marker>
  );
};

export default MyMarker;

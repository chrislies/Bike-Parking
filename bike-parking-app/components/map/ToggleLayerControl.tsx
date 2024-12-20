"use client";
import { useEffect } from "react";
import L from "leaflet";
import { useMap, TileLayer } from "react-leaflet";
import styles from "../../app/css/toggleLayerControl.module.css";
import ReactDOMServer from "react-dom/server";
import { Layers } from "@/public/svgs";

interface ToggleLayerControlProps {
  showRacks: boolean;
  showShelters: boolean;
  showSigns: boolean;
  handleToggleRacks: () => void;
  handleToggleSigns: () => void;
  handleToggleShelters: () => void;
  showStreetLayer: boolean;
  showSatelliteLayer: boolean;
  handleToggleStreetLayer: () => void;
  handleToggleSatelliteLayer: () => void;
}

export default function ToggleLayerControl({
  showRacks,
  showShelters,
  showSigns,
  handleToggleRacks,
  handleToggleSigns,
  handleToggleShelters,
  showStreetLayer,
  showSatelliteLayer,
  handleToggleStreetLayer,
  handleToggleSatelliteLayer,
}: ToggleLayerControlProps) {
  const map = useMap();

  useEffect(() => {
    const container = L.DomUtil.create("div", styles.control_container);
    container.setAttribute("role", "button");
    container.setAttribute("tabindex", "0");

    const layers_icon = L.DomUtil.create("div", styles.layers_icon, container);
    layers_icon.innerHTML = ReactDOMServer.renderToString(<Layers className={styles.svg} />);

    const content = L.DomUtil.create("div", styles.control_content, container);

    // Function to create a checkbox input
    const createCheckbox = (id: string, label: string, checked: boolean, onChange: () => void) => {
      const wrapper = L.DomUtil.create("label", styles.label, content);
      const input = L.DomUtil.create("input", styles.input, wrapper) as HTMLInputElement;
      input.type = "checkbox";
      input.id = id;
      input.checked = checked;
      input.addEventListener("change", onChange);
      wrapper.appendChild(document.createTextNode(label));
    };

    // Function to create a radio input
    const createRadio = (
      id: string,
      name: string,
      label: string,
      checked: boolean,
      onChange: () => void
    ) => {
      const wrapper = L.DomUtil.create("label", styles.label, content);
      const input = L.DomUtil.create("input", styles.input, wrapper) as HTMLInputElement;
      input.type = "radio";
      input.id = id;
      input.name = name;
      input.checked = checked;
      input.addEventListener("change", onChange);
      wrapper.appendChild(document.createTextNode(label));
    };

    createCheckbox("toggleRacks", "Bike Racks", showRacks, handleToggleRacks);
    createCheckbox("toggleShelters", "Bike Shelters", showShelters, handleToggleShelters);
    createCheckbox("toggleSigns", "Street Signs", showSigns, handleToggleSigns);

    // horizontal rule to separate marker toggles from layer toggles
    const hr = L.DomUtil.create("hr", "", content);
    hr.className = "border-t border-gray-300 my-1";

    createRadio("toggleStreetLayer", "mapLayer", "Street Layer", showStreetLayer, () => {
      handleToggleStreetLayer();
      if (showSatelliteLayer) handleToggleSatelliteLayer();
    });
    createRadio("toggleSatelliteLayer", "mapLayer", "Satellite Layer", showSatelliteLayer, () => {
      handleToggleSatelliteLayer();
      if (showStreetLayer) handleToggleStreetLayer();
    });

    // Prevent click and scroll propagation to the map
    L.DomEvent.disableClickPropagation(container);
    L.DomEvent.disableScrollPropagation(container);

    // Extend Leaflet control to add the custom control
    const toggleControl = L.Control.extend({
      onAdd: () => container,
    });

    const controlInstance = new toggleControl({ position: "topright" });
    map.addControl(controlInstance);

    // Cleanup function to remove the control from the map
    return () => {
      map.removeControl(controlInstance);
    };
  }, []); // Empty dependency array to ensure this runs only once

  return (
    <>
      {showStreetLayer && (
        <TileLayer
          maxZoom={24}
          maxNativeZoom={19}
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          // url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
      )}
      {showSatelliteLayer && (
        <TileLayer
          maxZoom={24}
          maxNativeZoom={20}
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        />
      )}
    </>
  );
}

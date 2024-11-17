import { useEffect } from "react";
import L from "leaflet";
import { useMap } from "react-leaflet";

export default function ToggleSpotsControl({
  showRacks,
  showSigns,
  handleToggleRacks,
  handleToggleSigns,
}) {
  const map = useMap();

  useEffect(() => {
    const toggleControl = L.Control.extend({
      onAdd: () => {
        const container = L.DomUtil.create(
          "div",
          "leaflet-control-layers leaflet-control-layers-expanded"
        );
        container.innerHTML = `
          <div>
            <label>
              <input type="checkbox" id="toggleRacks" ${
                showRacks ? "checked" : ""
              } />
              Bike Racks
            </label>
            <label>
              <input type="checkbox" id="toggleSigns" ${
                showSigns ? "checked" : ""
              } />
              Street Signs
            </label>
          </div>
        `;

        L.DomEvent.disableClickPropagation(container);
        L.DomEvent.disableScrollPropagation(container);

        container
          .querySelector("#toggleRacks")
          .addEventListener("change", handleToggleRacks);
        container
          .querySelector("#toggleSigns")
          .addEventListener("change", handleToggleSigns);

        return container;
      },
    });

    const controlInstance = new toggleControl({ position: "bottomleft" });
    map.addControl(controlInstance);

    return () => {
      map.removeControl(controlInstance);
    };
  }, [map, showRacks, showSigns, handleToggleRacks, handleToggleSigns]);

  return null;
}

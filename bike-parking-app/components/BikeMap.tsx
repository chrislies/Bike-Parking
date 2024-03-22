"use client";
import { useEffect, useState, useRef } from "react";
import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import { fromLonLat } from "ol/proj";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import { Vector as VectorLayer } from "ol/layer";
import { Vector as VectorSource } from "ol/source";
import {
  DragRotateAndZoom,
  defaults as defaultInteractions,
} from 'ol/interaction.js';
import {
  Style,
  Icon,
  Circle as CircleStyle,
  Stroke,
  Fill,
  Text,
} from "ol/style";
import { Cluster } from "ol/source";
import Overlay from "ol/Overlay.js";

const MarkerSvg =
  "data:image/svg+xml;charset=utf-8,%3C%3Fxml version%3D%221.0%22%20%3F%3E%3Csvg%20height%3D%2224%22%20version%3D%221.1%22%20width%3D%2224%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20xmlns%3Acc%3D%22http%3A%2F%2Fcreativecommons.org%2Fns%23%22%20xmlns%3Adc%3D%22http%3A%2F%2Fpurl.org%2Fdc%2Felements%2F1.1%2F%22%20xmlns%3Ardf%3D%22http%3A%2F%2Fwww.w3.org%2F1999%2F02%2F22-rdf-syntax-ns%23%22%3E%3Cg%20transform%3D%22translate(0%20-1028.4)%22%3E%3Cpath%20d%3D%22m12%200c-4.4183%202.3685e-15%20-8%203.5817-8%208%200%201.421%200.3816%202.75%201.0312%203.906%200.1079%200.192%200.221%200.381%200.3438%200.563l6.625%2011.531%206.625-11.531c0.102-0.151%200.19-0.311%200.281-0.469l0.063-0.094c0.649-1.156%201.031-2.485%201.031-3.906%200-4.4183-3.582-8-8-8zm0%204c2.209%200%204%201.7909%204%204%200%202.209-1.791%204-4%204-2.2091%200-4-1.791-4-4%200-2.2091%201.7909-4%204-4z%22%20fill%3D%22%23e74c3c%22%20transform%3D%22translate(0%201028.4)%22%2F%3E%3Cpath%20d%3D%22m12%203c-2.7614%200-5%202.2386-5%205%200%202.761%202.2386%205%205%205%202.761%200%205-2.239%205-5%200-2.7614-2.239-5-5-5zm0%202c1.657%200%203%201.3431%203%203s-1.343%203-3%203-3-1.3431-3-3%201.343-3%203-3z%22%20fill%3D%22%23c0392b%22%20transform%3D%22translate(0%201028.4)%22%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E";

if (typeof document !== "undefined") {
  const container = document.getElementById("popup");
  const content = document.getElementById("popup-content");
  const closer = document.getElementById("popup-closer");
}

interface DataItem {
  longitude: string;
  latitude: string;
}

export default function BikeMap() {
  const [dataArray, setDataArray] = useState<DataItem[]>([]);
  const mapRef = useRef<Map | null>(null);
  const addedCoordinates = useRef<Set<string>>(new Set());
  const [overlay, setOverlay] = useState<Overlay | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [mapLoading, setMapLoading] = useState<boolean>(true);
  const [fetchLoading, setFetchLoading] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const container = document.createElement("div");
    container.className = "ol-popup";
    const closer = document.createElement("a");
    closer.href = "#";
    closer.className = "ol-popup-closer";
    container.appendChild(closer);
    const content = document.createElement("div");
    content.id = "popup-content";
    container.appendChild(content);

    const newOverlay = new Overlay({
      element: container,
      autoPan: {
        animation: {
          duration: 250,
        },
      },
    });
    setOverlay(newOverlay);

    closer.onclick = function () {
      newOverlay.setPosition(undefined);
      closer.blur();
      return false;
    };
    setMapLoading(false); // Set mapLoading to true before fetching data
  }, []);

  const closeModal = () => {
    setModalVisible(false);
  };

  useEffect(() => {
    if (overlay) {
      overlay.setMap(null); // Remove previous overlay from map

      const fetchData = async () => {
        try {
          let allData: DataItem[] = [];
          let offset = 0;
          let hasMoreData = true;

          while (hasMoreData) {
            const bikeRacksResponse = await fetch(
              `https://data.cityofnewyork.us/resource/au7q-njtk.json?$limit=50000&$offset=${offset}` // bike racks
            );
            const bikeRacksData: DataItem[] = await bikeRacksResponse.json();

            const streetSignsResponse = await fetch(
              `https://data.cityofnewyork.us/resource/nfid-uabd.json?$limit=50000&$offset=${offset}` // street signs
            );
            const streetSignsData: DataItem[] =
              await streetSignsResponse.json();

            const combinedData: DataItem[] = [
              ...bikeRacksData.map((item) => ({
                ...item,
              })),
              ...streetSignsData.map((item) => ({
                ...item,
              })),
            ];

            if (combinedData.length === 0) {
              hasMoreData = false;
            } else {
              allData = [...allData, ...combinedData];
              offset += 50000;
            }
          }

          console.log(allData);
          setDataArray(allData);

          // Initialize the map
          const centerCoordinates = fromLonLat([-73.920935, 40.780229]);
          const map = new Map({
            interactions: defaultInteractions().extend([new DragRotateAndZoom()]),

            target: "map",
            layers: [
              new TileLayer({
                source: new OSM({
                  attributions: [],
                }),
              }),
            ],
            view: new View({
              center: centerCoordinates,
              zoom: 13,
              projection: "EPSG:3857",
            }),
          });
          mapRef.current = map;

          map.addOverlay(overlay);

          // Disable right-clicking on the map
          map.addEventListener("contextmenu", function (event) {
            event.preventDefault();
          });

          // Disable text selection on the map
          map.addEventListener("mousedown", function (event) {
            event.preventDefault();
          });

          return () => {
            if (mapRef.current) {
              mapRef.current.setTarget(undefined);
            }
          };
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

      // fetchData().then(() => {setFetchLoading(false)});
      fetchData();
    }
  }, [overlay]);

  useEffect(() => {
    const handleClickOutsideModal = (event: MouseEvent) => {
      const modal = document.querySelector(".modal-content");
      if (modal && !modal.contains(event.target as Node)) {
        closeModal();
      }
    };

    document.addEventListener("mouseup", handleClickOutsideModal);

    return () => {
      document.removeEventListener("mouseup", handleClickOutsideModal);
    };
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-100">
      {mapLoading || !dataArray || !overlay  ? (
        <div>
          <h1>Loading...</h1>
        </div>
      ) : (
        <>
          <div id="map" className="w-full h-full"></div>
          {modalVisible && (
            <div className="modal">
              <div className="modal-content">
                <span className="close" onClick={closeModal}>
                  &times;
                </span>
                <div dangerouslySetInnerHTML={{ __html: modalContent }}></div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

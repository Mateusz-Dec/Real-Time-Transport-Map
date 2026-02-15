import { useState, useEffect } from "react";
import "./App.css";
import "leaflet/dist/leaflet.css";
import "react-leaflet-markercluster/styles";
import {
  MapContainer,
  LayersControl,
  TileLayer,
  Polyline,
  useMapEvents,
  useMap,
  CircleMarker,
} from "react-leaflet";
import useVehicles from "./hooks/useVehicles";
import MarkerClusterGroup from "react-leaflet-cluster";
import VehicleMarker from "./VehicleMarker";
import StopMarker from "./hooks/StopMarker";
import FilterPanel from "./hooks/FilterPanel";
import LocateButton from "./LocateButton";

const MapClickHandler = ({ onClick }) => {
  useMapEvents({
    click: onClick,
  });
  return null;
};

const MapController = ({ selectedStop, onArrive }) => {
  const map = useMap();
  useEffect(() => {
    if (selectedStop) {
      onArrive(null);

      map.flyTo(selectedStop.position, 16, {
        duration: 2,
      });

      const timer = setTimeout(() => onArrive(selectedStop), 2000);
      return () => clearTimeout(timer);
    }
  }, [selectedStop, map, onArrive]);
  return null;
};

const StopHighlight = ({ selectedStop }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <CircleMarker
      center={selectedStop.position}
      radius={30}
      pathOptions={{
        color: "gold",
        fillColor: "gold",
        fillOpacity: 0.4,
        weight: 0,
      }}
    />
  );
};

const ResetViewButton = ({ center, zoom, onReset, darkMode }) => {
  const map = useMap();
  return (
    <button
      className={`reset-view-button ${darkMode ? "dark-mode" : ""}`}
      onClick={() => {
        map.setView(center, zoom);
        if (onReset) onReset();
      }}
    >
      ↺ Reset
    </button>
  );
};

function App() {
  const position = [50.0614, 19.9366];
  const { vehicles, routes, stops } = useVehicles();
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [selectedLine, setSelectedLine] = useState(null);
  const [selectedStop, setSelectedStop] = useState(null);
  const [arrivedStop, setArrivedStop] = useState(null);
  const [routeStart, setRouteStart] = useState(null);
  const [routeEnd, setRouteEnd] = useState(null);
  const [plannedRoute, setPlannedRoute] = useState(null);
  const [onlyLowFloor, setOnlyLowFloor] = useState(false);

  const handleSelectLine = (line) => {
    setSelectedLine(line);
    setSearchTerm(line || "");
  };

  const handleReset = () => {
    setFilter("all");
    setSearchTerm("");
    setSelectedLine(null);
    setSelectedStop(null);
    setArrivedStop(null);
    setRouteStart(null);
    setRouteEnd(null);
    setPlannedRoute(null);
    setOnlyLowFloor(false);
  };

  const filteredVehicles = vehicles.filter(
    (v) =>
      (filter === "all" || v.type === filter) &&
      (selectedLine ? v.line === selectedLine : true) &&
      v.line.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (!onlyLowFloor || v.lowFloor),
  );

  useEffect(() => {
    if (routeStart && routeEnd) {
      const findLine = () => {
        for (const vehicle of vehicles) {
          const routeStops = routes[vehicle.line]?.map(
            (pos) => stops.find((s) => s.position === pos)?.name,
          );
          if (
            routeStops &&
            routeStops.includes(routeStart) &&
            routeStops.includes(routeEnd)
          ) {
            return vehicle.line;
          }
        }
        return null;
      };
      setPlannedRoute(findLine());
    } else {
      setPlannedRoute(null);
    }
  }, [routeStart, routeEnd, vehicles, routes, stops]);

  const visibleRoutes = Object.entries(routes).filter(
    ([line]) => line === selectedLine || line === plannedRoute,
  );
  return (
    <>
      <MapContainer className="map-container" center={position} zoom={13}>
        <MapClickHandler onClick={() => handleSelectLine(null)} />

        <MapController selectedStop={selectedStop} onArrive={setArrivedStop} />
        {arrivedStop && (
          <StopHighlight key={arrivedStop.id} selectedStop={arrivedStop} />
        )}

        <LayersControl position="bottomright">
          <LayersControl.BaseLayer checked={!darkMode} name="Mapa (Jasna)">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer checked={darkMode} name="Mapa (Ciemna)">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Satelita">
            <TileLayer
              attribution="Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Teren">
            <TileLayer
              attribution='Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
              url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
            />
          </LayersControl.BaseLayer>
          <LayersControl.Overlay name="Szyny (OpenRailwayMap)">
            <TileLayer
              attribution='Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | Map style: &copy; <a href="https://www.OpenRailwayMap.org">OpenRailwayMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
              url="https://{s}.tiles.openrailwaymap.org/standard/{z}/{x}/{y}.png"
              maxZoom={19}
            />
          </LayersControl.Overlay>
        </LayersControl>

        <ResetViewButton
          center={position}
          zoom={13}
          onReset={handleReset}
          darkMode={darkMode}
        />
        <LocateButton darkMode={darkMode} />

        <MarkerClusterGroup>
          {stops.map((stop) => (
            <StopMarker key={stop.id} stop={stop} />
          ))}
        </MarkerClusterGroup>

        {visibleRoutes.map(([line, positions]) => (
          <Polyline
            key={line}
            positions={positions}
            pathOptions={{
              color:
                line === "50" || line === "4" || line === "8"
                  ? "#dc3545"
                  : "#007bff",
              weight: 4,
              opacity: 0.6,
            }}
          />
        ))}

        {filteredVehicles.map((vehicle) => (
          <VehicleMarker
            key={vehicle.id}
            vehicle={vehicle}
            onSelect={handleSelectLine}
          />
        ))}
      </MapContainer>
      <FilterPanel
        currentFilter={filter}
        setFilter={setFilter}
        vehicles={filteredVehicles}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        lines={Object.keys(routes)}
        selectedLine={selectedLine}
        onSelectLine={handleSelectLine}
        stops={stops}
        onSelectStop={setSelectedStop}
        routeStart={routeStart}
        setRouteStart={setRouteStart}
        routeEnd={routeEnd}
        setRouteEnd={setRouteEnd}
        plannedRoute={plannedRoute}
        onlyLowFloor={onlyLowFloor}
        setOnlyLowFloor={setOnlyLowFloor}
      />
    </>
  );
}

export default App;

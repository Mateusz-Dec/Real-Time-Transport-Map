import { useState, useEffect } from "react";
import "./App.css";
import {
  MapContainer,
  TileLayer,
  Polyline,
  useMapEvents,
  useMap,
  CircleMarker,
} from "react-leaflet";
import useVehicles from "./hooks/useVehicles";
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

function App() {
  const position = [50.0614, 19.9366];
  const { vehicles, routes, stops } = useVehicles();
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [selectedLine, setSelectedLine] = useState(null);
  const [selectedStop, setSelectedStop] = useState(null);
  const [arrivedStop, setArrivedStop] = useState(null);

  const handleSelectLine = (line) => {
    setSelectedLine(line);
    setSearchTerm(line || "");
  };

  const filteredVehicles = vehicles.filter(
    (v) =>
      (filter === "all" || v.type === filter) &&
      (selectedLine ? v.line === selectedLine : true) &&
      v.line.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const tileUrl = darkMode
    ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
    : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

  const visibleRoutes = Object.entries(routes).filter(([line]) => {
    return line === selectedLine;
  });

  return (
    <>
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
      />
      <MapContainer className="map-container" center={position} zoom={13}>
        <MapClickHandler onClick={() => handleSelectLine(null)} />

        <MapController selectedStop={selectedStop} onArrive={setArrivedStop} />
        {arrivedStop && (
          <StopHighlight key={arrivedStop.id} selectedStop={arrivedStop} />
        )}

        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url={tileUrl}
        />
        <LocateButton />

        {stops.map((stop) => (
          <StopMarker key={stop.id} stop={stop} />
        ))}

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
    </>
  );
}

export default App;

import { useMemo } from "react";
import { Marker, Popup } from "react-leaflet";
import L from "leaflet";

const VehicleMarker = ({ vehicle, onSelect }) => {
  const bearing = vehicle.bearing || 0;

  const icon = useMemo(
    () =>
      L.divIcon({
        className: "vehicle-marker-container",
        html: `
          <div class="vehicle-icon-wrapper" style="transform: rotate(${bearing}deg);">
            <div class="vehicle-icon ${vehicle.type}" style="transform: rotate(${-bearing}deg);">
              ${vehicle.line}
            </div>
            <div class="vehicle-arrow"></div>
          </div>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 20],
        popupAnchor: [0, -20],
      }),
    [vehicle.type, vehicle.line, bearing],
  );

  return (
    <Marker position={vehicle.position} icon={icon}>
      <Popup
        eventHandlers={{
          add: () => onSelect(vehicle.line),
          remove: () => onSelect(null),
        }}
      >
        <strong>
          {vehicle.type === "bus" ? "Autobus" : "Tramwaj"} linii {vehicle.line}
        </strong>
        <br />
        Kierunek: {vehicle.destination}
        <br />
        Opóźnienie:{" "}
        <span
          style={{
            color: vehicle.delay > 0 ? "red" : "green",
            fontWeight: "bold",
          }}
        >
          {vehicle.delay > 0 ? `${vehicle.delay} min` : "O czasie"}
        </span>
        <br />
        {vehicle.lowFloor ? (
          <span
            style={{ color: "#007bff", fontWeight: "bold", fontSize: "0.9em" }}
          >
            ♿ Pojazd niskopodłogowy
          </span>
        ) : (
          <span style={{ color: "#666", fontSize: "0.9em" }}>
            ⚠️ Wysoka podłoga
          </span>
        )}
        {vehicle.nextStops && (
          <div className="schedule-info">
            <h4>Najbliższe przystanki:</h4>
            <ul>
              {vehicle.nextStops.map((stop, idx) => (
                <li key={idx}>{stop}</li>
              ))}
            </ul>
          </div>
        )}
      </Popup>
    </Marker>
  );
};

export default VehicleMarker;

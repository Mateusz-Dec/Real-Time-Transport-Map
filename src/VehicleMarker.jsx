import { useMemo } from "react";
import { Marker, Popup } from "react-leaflet";
import L from "leaflet";

const VehicleMarker = ({ vehicle, onSelect }) => {
  const icon = useMemo(
    () =>
      L.divIcon({
        className: `vehicle-icon ${vehicle.type}`,
        html: `<span>${vehicle.line}</span>`,
        iconSize: [30, 30],
        iconAnchor: [15, 15],
        popupAnchor: [0, -15],
      }),
    [vehicle.type, vehicle.line],
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

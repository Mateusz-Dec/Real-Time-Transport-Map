import React, { useMemo } from "react";
import { Marker, Tooltip, Popup } from "react-leaflet";
import L from "leaflet";

const StopMarker = ({ stop }) => {
  const schedule = useMemo(() => {
    const lines = ["4", "14", "20", "50", "52", "144", "173"];
    return Array.from({ length: 5 })
      .map(() => ({
        line: lines[Math.floor(Math.random() * lines.length)],
        time: Math.floor(Math.random() * 20) + 1,
      }))
      .sort((a, b) => a.time - b.time);
  }, []);

  const icon = L.divIcon({
    className: "stop-marker-container",
    html: `
      <div class="stop-marker-icon">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M19 17h2l.64-2.54c.24-.959.24-1.962.24-1.962H2.12s0 1 .24 1.962L3 17h2"></path>
          <path d="M16 17h-8"></path>
          <path d="M4 17v3h2v-3"></path>
          <path d="M18 17v3h2v-3"></path>
          <path d="M17 11H7V8a5 5 0 0 1 10 0v3z"></path>
        </svg>
      </div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });

  return (
    <Marker position={stop.position} icon={icon}>
      <Tooltip direction="top" offset={[0, -5]} opacity={1}>
        {stop.name}
      </Tooltip>
      <Popup>
        <strong>{stop.name}</strong>
        <div className="stop-schedule">
          <h5>Najbliższe odjazdy:</h5>
          <ul>
            {schedule.map((item, idx) => (
              <li key={idx}>
                <span className="line-badge">{item.line}</span> {item.time} min
              </li>
            ))}
          </ul>
        </div>
      </Popup>
    </Marker>
  );
};

export default React.memo(StopMarker);

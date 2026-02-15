import React, { useMemo } from "react";
import { CircleMarker, Tooltip, Popup } from "react-leaflet";

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

  return (
    <CircleMarker
      center={stop.position}
      radius={8}
      pathOptions={{
        color: "#555",
        fillColor: "white",
        fillOpacity: 1,
        weight: 2,
      }}
    >
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
    </CircleMarker>
  );
};

export default React.memo(StopMarker);

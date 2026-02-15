import React from "react";
import { useMap } from "react-leaflet";

const LocateButton = () => {
  const map = useMap();

  const handleLocate = () => {
    map.locate().on("locationfound", function (e) {
      map.flyTo(e.latlng, 14);
    });
  };

  return (
    <button className="locate-button" onClick={handleLocate}>
      📍 Moja lokalizacja
    </button>
  );
};

export default LocateButton;

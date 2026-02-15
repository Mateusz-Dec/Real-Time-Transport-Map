import React, { useState } from "react";

const FilterPanel = ({
  currentFilter,
  setFilter,
  vehicles,
  searchTerm,
  setSearchTerm,
  darkMode,
  setDarkMode,
  lines,
  selectedLine,
  onSelectLine,
  stops,
  onSelectStop,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isStopModalOpen, setIsStopModalOpen] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const count = vehicles.length;
  const avgDelay =
    count > 0
      ? (vehicles.reduce((acc, v) => acc + v.delay, 0) / count).toFixed(1)
      : 0;

  const filteredLines = lines
    ? lines.filter((line) =>
        line.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    : [];

  const filteredStops = stops
    ? stops.filter((stop) =>
        stop.name.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    : [];

  const getLineType = (line) => {
    const vehicle = vehicles.find((v) => v.line === line);
    if (vehicle) return vehicle.type;
    return line.length < 3 ? "tram" : "bus";
  };

  const tramLines = filteredLines.filter(
    (line) => getLineType(line) === "tram",
  );
  const busLines = filteredLines.filter((line) => getLineType(line) === "bus");

  if (isCollapsed) {
    return (
      <button
        className={`filter-panel-toggle ${darkMode ? "dark-mode" : ""}`}
        onClick={() => setIsCollapsed(false)}
      >
        Filtry ☰
      </button>
    );
  }

  return (
    <div className={`filter-panel ${darkMode ? "dark-mode" : ""}`}>
      <div className="panel-header">
        <h3>Filtry</h3>
        <button className="collapse-btn" onClick={() => setIsCollapsed(true)}>
          −
        </button>
      </div>
      <div className="search-container">
        <input
          type="text"
          placeholder="Szukaj linii (np. 4)"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setShowSuggestions(true);
            if (e.target.value === "") {
              onSelectLine(null);
            }
          }}
          onFocus={() => setShowSuggestions(true)}
          className="search-input"
        />
        {searchTerm && (
          <button
            className="clear-search-btn"
            onClick={() => {
              setSearchTerm("");
              onSelectLine(null);
              setShowSuggestions(false);
            }}
          >
            &times;
          </button>
        )}
        {showSuggestions && searchTerm && filteredLines.length > 0 && (
          <ul className="suggestions-list">
            {filteredLines.map((line) => (
              <li
                key={line}
                onClick={() => {
                  onSelectLine(line);
                  setSearchTerm(line);
                  setShowSuggestions(false);
                }}
              >
                <span className={`dot ${getLineType(line)}`}></span>
                {line}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="lines-list-section">
        <h4>Wybierz linię:</h4>
        <button className="open-modal-btn" onClick={() => setIsModalOpen(true)}>
          {selectedLine ? `Wybrano: ${selectedLine}` : "Pokaż listę linii"}
        </button>
        <button
          className="open-modal-btn"
          style={{ marginTop: "5px" }}
          onClick={() => setIsStopModalOpen(true)}
        >
          Pokaż listę przystanków
        </button>
      </div>

      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h4>Dostępne linie</h4>
              <button
                className="close-modal-btn"
                onClick={() => setIsModalOpen(false)}
              >
                &times;
              </button>
            </div>

            {tramLines.length > 0 && (
              <h5 className="lines-group-title">Tramwaje</h5>
            )}
            <div className="lines-grid-modal tram-grid">
              {tramLines.map((line) => (
                <button
                  key={line}
                  className={`line-btn ${selectedLine === line ? "selected" : ""}`}
                  onClick={() => {
                    onSelectLine(line === selectedLine ? null : line);
                    setIsModalOpen(false);
                  }}
                >
                  {line}
                </button>
              ))}
            </div>

            {busLines.length > 0 && (
              <h5 className="lines-group-title">Autobusy</h5>
            )}
            <div className="lines-grid-modal bus-grid">
              {busLines.map((line) => (
                <button
                  key={line}
                  className={`line-btn ${selectedLine === line ? "selected" : ""}`}
                  onClick={() => {
                    onSelectLine(line === selectedLine ? null : line);
                    setIsModalOpen(false);
                  }}
                >
                  {line}
                </button>
              ))}
            </div>
            {filteredLines.length === 0 && (
              <p
                style={{
                  textAlign: "center",
                  color: "#888",
                  marginTop: "10px",
                }}
              >
                Brak linii
              </p>
            )}
          </div>
        </div>
      )}

      {isStopModalOpen && (
        <div
          className="modal-overlay"
          onClick={() => setIsStopModalOpen(false)}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h4>Wybierz przystanek</h4>
              <button
                className="close-modal-btn"
                onClick={() => setIsStopModalOpen(false)}
              >
                &times;
              </button>
            </div>
            <div className="stops-grid-modal">
              {filteredStops.map((stop) => (
                <button
                  key={stop.id}
                  className="stop-btn"
                  onClick={() => {
                    onSelectStop(stop);
                    setIsStopModalOpen(false);
                  }}
                >
                  {stop.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="filter-buttons">
        <button
          className={currentFilter === "all" ? "active" : ""}
          onClick={() => setFilter("all")}
        >
          Wszystkie
        </button>
        <button
          className={currentFilter === "bus" ? "active" : ""}
          onClick={() => setFilter("bus")}
        >
          Autobusy
        </button>
        <button
          className={currentFilter === "tram" ? "active" : ""}
          onClick={() => setFilter("tram")}
        >
          Tramwaje
        </button>
      </div>

      <div className="stats-section">
        <div className="stats-row">
          <span>Widoczne:</span> <strong>{count}</strong>
        </div>
        <div className="stats-row">
          <span>Śr. opóźnienie:</span>{" "}
          <span
            style={{
              color: avgDelay > 0 ? "#d32f2f" : "#388e3c",
              fontWeight: "bold",
            }}
          >
            {avgDelay} min
          </span>
        </div>
      </div>

      <div className="legend">
        <p>
          <span className="dot bus"></span> Autobus
        </p>
        <p>
          <span className="dot tram"></span> Tramwaj
        </p>
      </div>

      <div className="theme-toggle-section">
        <button onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? "☀️ Tryb Jasny" : "🌙 Tryb Ciemny"}
        </button>
      </div>
    </div>
  );
};

export default FilterPanel;

import React, { useState, useEffect } from "react";

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
  routeStart,
  setRouteStart,
  routeEnd,
  setRouteEnd,
  plannedRoute,
  onlyLowFloor,
  setOnlyLowFloor,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isStopModalOpen, setIsStopModalOpen] = useState(false);
  const [isRoutePlannerOpen, setIsRoutePlannerOpen] = useState(false);
  const [isLegendOpen, setIsLegendOpen] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [localRouteStart, setLocalRouteStart] = useState(routeStart);
  const [localRouteEnd, setLocalRouteEnd] = useState(routeEnd);

  useEffect(() => {
    setLocalRouteStart(routeStart);
    setLocalRouteEnd(routeEnd);
  }, [routeStart, routeEnd]);

  const handleSearchRoute = () => {
    setRouteStart(localRouteStart);
    setRouteEnd(localRouteEnd);
  };

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

  const toggleFavorite = (line, e) => {
    e.stopPropagation();
    if (favorites.includes(line)) {
      setFavorites(favorites.filter((f) => f !== line));
    } else {
      setFavorites([...favorites, line]);
    }
  };

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
          placeholder="Szukaj linii lub przystanku..."
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
        {showSuggestions &&
          searchTerm &&
          (filteredLines.length > 0 || filteredStops.length > 0) && (
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

              {filteredStops.map((stop) => (
                <li
                  key={`stop-${stop.id}`}
                  onClick={() => {
                    onSelectStop(stop);
                    setSearchTerm(stop.name);
                    setShowSuggestions(false);
                  }}
                >
                  <span className="dot stop"></span> {stop.name}
                </li>
              ))}
            </ul>
          )}
      </div>

      <div className="lines-list-section">
        <h4>Menu:</h4>
        <button className="open-modal-btn" onClick={() => setIsModalOpen(true)}>
          {selectedLine ? `Wybrano: ${selectedLine}` : "Wybierz linię"}
        </button>
        <button
          className="open-modal-btn"
          style={{ marginTop: "5px" }}
          onClick={() => setIsStopModalOpen(true)}
        >
          Wybierz przystanek
        </button>
        <button
          className="open-modal-btn"
          style={{ marginTop: "5px" }}
          onClick={() => setIsRoutePlannerOpen(true)}
        >
          Zaplanuj trasę
        </button>
        <button
          className="open-modal-btn"
          style={{ marginTop: "5px" }}
          onClick={() => setIsLegendOpen(true)}
        >
          Legenda
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

            {favorites.length > 0 && (
              <>
                <h5 className="lines-group-title">Ulubione ⭐</h5>
                <div className="lines-grid-modal">
                  {favorites.map((line) => (
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
              </>
            )}

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
                  <span
                    className={`fav-star ${favorites.includes(line) ? "active" : ""}`}
                    onClick={(e) => toggleFavorite(line, e)}
                    title={
                      favorites.includes(line)
                        ? "Usuń z ulubionych"
                        : "Dodaj do ulubionych"
                    }
                  >
                    ★
                  </span>
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
                  <span
                    className={`fav-star ${favorites.includes(line) ? "active" : ""}`}
                    onClick={(e) => toggleFavorite(line, e)}
                    title={
                      favorites.includes(line)
                        ? "Usuń z ulubionych"
                        : "Dodaj do ulubionych"
                    }
                  >
                    ★
                  </span>
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

      {isRoutePlannerOpen && (
        <div
          className="modal-overlay"
          onClick={() => setIsRoutePlannerOpen(false)}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h4>Zaplanuj trasę</h4>
              <button
                className="close-modal-btn"
                onClick={() => setIsRoutePlannerOpen(false)}
              >
                &times;
              </button>
            </div>
            <div className="route-planner-inputs">
              <select
                value={localRouteStart || ""}
                onChange={(e) => setLocalRouteStart(e.target.value)}
              >
                <option value="">Wybierz początek</option>
                {stops.map((stop) => (
                  <option key={stop.id} value={stop.name}>
                    {stop.name}
                  </option>
                ))}
              </select>
              <select
                value={localRouteEnd || ""}
                onChange={(e) => setLocalRouteEnd(e.target.value)}
              >
                <option value="">Wybierz koniec</option>
                {stops.map((stop) => (
                  <option key={stop.id} value={stop.name}>
                    {stop.name}
                  </option>
                ))}
              </select>

              <button className="search-route-btn" onClick={handleSearchRoute}>
                Pokaż trasę
              </button>

              {plannedRoute && (
                <div className="route-result">
                  <h5>Znaleziono połączenie:</h5>
                  <div className="route-info-card">
                    <div
                      className="route-line-badge"
                      style={{
                        backgroundColor:
                          getLineType(plannedRoute) === "tram"
                            ? "#dc3545"
                            : "#007bff",
                      }}
                    >
                      {plannedRoute}
                    </div>
                    <div className="route-details">
                      <p>
                        <strong>Wsiądź:</strong> {routeStart}
                      </p>
                      <p>
                        <strong>Wysiądź:</strong> {routeEnd}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {routeStart && routeEnd && !plannedRoute && (
                <p className="no-route-msg">Brak bezpośredniego połączenia.</p>
              )}

              {(routeStart || routeEnd) && (
                <button
                  className="clear-route-btn"
                  onClick={() => {
                    setRouteStart(null);
                    setRouteEnd(null);
                  }}
                >
                  Wyczyść trasę
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {isLegendOpen && (
        <div className="modal-overlay" onClick={() => setIsLegendOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h4>Legenda</h4>
              <button
                className="close-modal-btn"
                onClick={() => setIsLegendOpen(false)}
              >
                &times;
              </button>
            </div>
            <div className="legend">
              <p>
                <span className="dot bus"></span> Autobus
              </p>
              <p>
                <span className="dot tram"></span> Tramwaj
              </p>
              <p>
                <span
                  className="stop-marker-icon"
                  style={{
                    width: "14px",
                    height: "14px",
                    marginRight: "5px",
                    boxShadow: "none",
                    border: "1px solid #007bff",
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ width: "100%", height: "100%" }}
                  >
                    <path d="M19 17h2l.64-2.54c.24-.959.24-1.962.24-1.962H2.12s0 1 .24 1.962L3 17h2"></path>
                    <path d="M16 17h-8"></path>
                    <path d="M4 17v3h2v-3"></path>
                    <path d="M18 17v3h2v-3"></path>
                    <path d="M17 11H7V8a5 5 0 0 1 10 0v3z"></path>
                  </svg>
                </span>{" "}
                <span style={{ marginLeft: "2px" }}>Przystanek</span>
              </p>
              <hr
                style={{
                  margin: "10px 0",
                  border: "0",
                  borderTop: "1px solid #eee",
                }}
              />
              <p>
                <span className="dot cluster-small"></span> Mała grupa (&lt;10)
              </p>
              <p>
                <span className="dot cluster-medium"></span> Średnia grupa
                (&lt;100)
              </p>
              <p>
                <span className="dot cluster-large"></span> Duża grupa (&gt;100)
              </p>
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

      <div className="toggle-container">
        <span className="toggle-label">Tylko niskopodłogowe ♿</span>
        <label className="switch">
          <input
            type="checkbox"
            checked={onlyLowFloor}
            onChange={(e) => setOnlyLowFloor(e.target.checked)}
          />
          <span className="slider"></span>
        </label>
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

      <div className="theme-toggle-section">
        <button onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? "☀️ Tryb Jasny" : "🌙 Tryb Ciemny"}
        </button>
      </div>
    </div>
  );
};

export default FilterPanel;

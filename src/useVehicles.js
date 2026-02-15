import { useState, useEffect } from "react";

// Baza współrzędnych przystanków (wspólna dla tras i markerów)
const stopsData = {
  "Bronowice Małe": [50.085, 19.89],
  "Teatr Bagatela": [50.064, 19.936],
  "Stary Kleparz": [50.066, 19.94],
  "Teatr Słowackiego": [50.064, 19.943],
  "Rondo Mogilskie": [50.068, 19.955],
  Korona: [50.045, 19.945],
  "Borek Fałęcki": [50.015, 19.945],
  "Krowodrza Górka": [50.092, 19.935],
  "Rondo Grunwaldzkie": [50.048, 19.936],
  Jubilat: [50.055, 19.93],
  "Muzeum Narodowe": [50.06, 19.925],
  "AGH / UR": [50.065, 19.92],
  "Wzgórza Krzesławickie": [50.08, 20.03],
  Rżąka: [50.01, 20.01],
  "Dworzec Główny Tunel": [50.075, 19.945],
  Klimeckiego: [50.055, 19.96],
  "Czerwone Maki": [50.0, 19.89],
};

// Generowanie listy przystanków dla mapy
const mockStops = Object.entries(stopsData).map(([name, position], id) => ({
  id: id + 1,
  name,
  position,
}));

// Definicje tras (sekwencje punktów)
const mockRoutes = {
  4: [
    stopsData["Bronowice Małe"],
    [50.072, 19.905],
    stopsData["Teatr Bagatela"],
    stopsData["Stary Kleparz"],
    stopsData["Teatr Słowackiego"],
    stopsData["Rondo Mogilskie"],
    stopsData["Wzgórza Krzesławickie"],
  ],
  50: [
    stopsData["Krowodrza Górka"],
    stopsData["Dworzec Główny Tunel"],
    stopsData["Rondo Mogilskie"],
    stopsData["Klimeckiego"],
    stopsData["Borek Fałęcki"],
  ],
  144: [
    [50.095, 19.92], // Prądnik Biały
    stopsData["AGH / UR"],
    stopsData["Muzeum Narodowe"],
    stopsData["Jubilat"],
    stopsData["Rondo Grunwaldzkie"],
    stopsData["Rżąka"],
  ],
  8: [
    stopsData["Bronowice Małe"],
    stopsData["Teatr Bagatela"],
    stopsData["Stary Kleparz"],
    stopsData["Teatr Słowackiego"],
    stopsData["Korona"],
    stopsData["Borek Fałęcki"],
  ],
  173: [
    stopsData["AGH / UR"],
    stopsData["Muzeum Narodowe"],
    stopsData["Jubilat"],
    stopsData["Rondo Grunwaldzkie"],
    stopsData["Rżąka"],
  ],
};

// Pojazdy startowe (z indeksem trasy i postępem)
const initialVehicles = [
  {
    id: "1",
    type: "tram",
    line: "4",
    destination: "Wzgórza Krzesławickie",
    delay: 2,
    routeIndex: 2, // Startuje w okolicach Bagateli
    progress: 0.0,
    nextStops: ["Teatr Bagatela", "Stary Kleparz", "Teatr Słowackiego"],
  },
  {
    id: "2",
    type: "tram",
    line: "50",
    destination: "Borek Fałęcki",
    delay: 0,
    routeIndex: 1, // Startuje w Tunelu
    progress: 0.5,
    nextStops: ["Rondo Mogilskie", "Klimeckiego"],
  },
  {
    id: "3",
    type: "bus",
    line: "144",
    destination: "Rżąka",
    delay: 5,
    routeIndex: 3, // Startuje przy Jubilacie
    progress: 0.2,
    nextStops: ["Jubilat", "Rondo Grunwaldzkie", "Mateczny"],
  },
  {
    id: "4",
    type: "tram",
    line: "8",
    destination: "Borek Fałęcki",
    delay: 1,
    routeIndex: 3,
    progress: 0.8,
    nextStops: ["Korona (12:10)", "Smolki (12:12)", "Rzemieślnicza (12:14)"],
  },
  {
    id: "5",
    type: "bus",
    line: "173",
    destination: "Nowy Bieżanów",
    delay: 8,
    routeIndex: 1, // Startuje przy AGH
    progress: 0.4,
    nextStops: ["AGH / UR", "Muzeum Narodowe", "Jubilat"],
  },
];

const useVehicles = () => {
  // Inicjalizacja pozycji na podstawie tras
  const [vehicles, setVehicles] = useState(
    initialVehicles.map((v) => {
      const route = mockRoutes[v.line];
      // Pozycja startowa: jeśli trasa istnieje, bierzemy punkt startowy, w przeciwnym razie domyślny
      const pos =
        route && route[v.routeIndex] ? route[v.routeIndex] : [50.06, 19.94];
      return { ...v, position: pos };
    }),
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setVehicles((currentVehicles) =>
        currentVehicles.map((vehicle) => {
          const route = mockRoutes[vehicle.line];
          if (!route || route.length < 2) return vehicle;

          let { routeIndex, progress } = vehicle;
          const speed = 0.005; // Prędkość poruszania się

          progress += speed;

          // Przejście do kolejnego segmentu trasy
          if (progress >= 1) {
            progress = 0;
            routeIndex++;
            if (routeIndex >= route.length - 1) {
              routeIndex = 0; // Pętla (autobus wraca na start)
            }
          }

          // Interpolacja liniowa między punktami trasy
          const p1 = route[routeIndex];
          const p2 = route[routeIndex + 1];
          const lat = p1[0] + (p2[0] - p1[0]) * progress;
          const lng = p1[1] + (p2[1] - p1[1]) * progress;

          return {
            ...vehicle,
            routeIndex,
            progress,
            position: [lat, lng],
          };
        }),
      );
    }, 50); // Częsta aktualizacja dla płynnej animacji (50ms = 20fps)

    return () => clearInterval(interval);
  }, []);

  return { vehicles, routes: mockRoutes, stops: mockStops };
};

export default useVehicles;

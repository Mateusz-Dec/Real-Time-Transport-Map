import { useState, useEffect } from "react";

// Baza współrzędnych przystanków (wspólna dla tras i markerów)
const stopsData = {
  "Bronowice Małe": [50.085, 19.890],
  "Teatr Bagatela": [50.064, 19.936],
  "Stary Kleparz": [50.066, 19.940],
  "Teatr Słowackiego": [50.064, 19.943],
  "Rondo Mogilskie": [50.068, 19.955],
  "Korona": [50.045, 19.945],
  "Borek Fałęcki": [50.015, 19.945],
  "Krowodrza Górka": [50.092, 19.935],
  "Rondo Grunwaldzkie": [50.048, 19.936],
  "Jubilat": [50.055, 19.930],
  "Muzeum Narodowe": [50.060, 19.925],
  "AGH / UR": [50.065, 19.920],
  "Wzgórza Krzesławickie": [50.080, 20.030],
  "Rżąka": [50.010, 20.010],
  "Dworzec Główny Tunel": [50.075, 19.945],
  "Klimeckiego": [50.055, 19.960],
  "Czerwone Maki": [50.000, 19.890],
};

const mockStops = Object.entries(stopsData).map(([name, position], id) => ({
  id: id + 1,
  name,
  position,
}));

const mockRoutes = {
  "4": [
    stopsData["Bronowice Małe"],
    [50.072, 19.905],
    stopsData["Teatr Bagatela"],
    stopsData["Stary Kleparz"],
    stopsData["Teatr Słowackiego"],
    stopsData["Rondo Mogilskie"],
    stopsData["Wzgórza Krzesławickie"],
  ],
  "50": [
    stopsData["Krowodrza Górka"],
    stopsData["Dworzec Główny Tunel"],
    stopsData["Rondo Mogilskie"],
    stopsData["Klimeckiego"],
    stopsData["Borek Fałęcki"],
  ],
  "144": [
    [50.095, 19.920], // Prądnik Biały
    stopsData["AGH / UR"],
    stopsData["Muzeum Narodowe"],
    stopsData["Jubilat"],
    stopsData["Rondo Grunwaldzkie"],
    stopsData["Rżąka"],
  ],
  "8": [
    stopsData["Bronowice Małe"],
    stopsData["Teatr Bagatela"],
    stopsData["Stary Kleparz"],
    stopsData["Teatr Słowackiego"],
    stopsData["Korona"],
    stopsData["Borek Fałęcki"],
  ],
  "173": [
    stopsData["AGH / UR"],
    stopsData["Muzeum Narodowe"],
    stopsData["Jubilat"],
    stopsData["Rondo Grunwaldzkie"],
    stopsData["Rżąka"],
  ]
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
      const pos = route && route[v.routeIndex] ? route[v.routeIndex] : [50.06, 19.94];
      return { ...v, position: pos };
    })
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setVehicles((currentVehicles) =>
        currentVehicles.map((vehicle) => {
          const route = mockRoutes[vehicle.line];
          if (!route || route.length < 2) return vehicle;

          let { routeIndex, progress } = vehicle;
          const speed = 0.001; // Prędkość poruszania się

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
        })
      );
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return { vehicles, routes: mockRoutes, stops: mockStops };
};

export default useVehicles;
import { useState, useEffect } from "react";

// Współrzędne tras (uproszczone)
const mockRoutes = {
  4: [
    [50.085, 19.89], // Bronowice Małe
    [50.072, 19.905],
    [50.064, 19.925],
    [50.062, 19.936], // Bagatela
    [50.059, 19.942],
    [50.065, 19.955],
    [50.08, 20.03], // Wzgórza
  ],
  50: [
    [50.092, 19.935], // Krowodrza Górka
    [50.075, 19.945],
    [50.065, 19.955],
    [50.055, 19.96],
    [50.045, 19.955],
    [50.015, 19.945], // Borek
  ],
  144: [
    [50.095, 19.92], // Prądnik
    [50.065, 19.925],
    [50.055, 19.93],
    [50.045, 19.935],
    [50.01, 20.01], // Rżąka
  ],
  8: [
    [50.085, 19.89],
    [50.062, 19.936],
    [50.059, 19.942],
    [50.04, 19.94],
    [50.015, 19.945],
  ],
};

const mockStops = [
  { id: 1, name: "Teatr Bagatela", position: [50.062, 19.936] },
  { id: 2, name: "Stary Kleparz", position: [50.066, 19.94] },
  { id: 3, name: "Teatr Słowackiego", position: [50.064, 19.943] },
  { id: 4, name: "Rondo Mogilskie", position: [50.068, 19.955] },
  { id: 5, name: "Korona", position: [50.045, 19.945] },
  { id: 6, name: "Borek Fałęcki", position: [50.015, 19.945] },
  { id: 7, name: "Krowodrza Górka", position: [50.092, 19.935] },
  { id: 8, name: "Bronowice Małe", position: [50.085, 19.89] },
  { id: 9, name: "Rondo Grunwaldzkie", position: [50.048, 19.936] },
  { id: 10, name: "Jubilat", position: [50.055, 19.93] },
];

const mockVehicles = [
  {
    id: "1",
    type: "tram",
    line: "4",
    destination: "Wzgórza Krzesławickie",
    delay: 2,
    position: [50.062, 19.936], // Bagatela
    nextStops: [
      "Teatr Bagatela (12:00)",
      "Stary Kleparz (12:02)",
      "Teatr Słowackiego (12:05)",
    ],
  },
  {
    id: "2",
    type: "tram",
    line: "50",
    destination: "Borek Fałęcki",
    delay: 0,
    position: [50.075, 19.945], // Tunel
    nextStops: [
      "Dworzec Główny Tunel (12:05)",
      "Rondo Mogilskie (12:08)",
      "Klimeckiego (12:12)",
    ],
  },
  {
    id: "3",
    type: "bus",
    line: "144",
    destination: "Rżąka",
    delay: 5,
    position: [50.055, 19.93], // Jubilat
    nextStops: [
      "Jubilat (12:01)",
      "Rondo Grunwaldzkie (12:03)",
      "Mateczny (12:06)",
    ],
  },
  {
    id: "4",
    type: "tram",
    line: "8",
    destination: "Borek Fałęcki",
    delay: 1,
    position: [50.05, 19.94],
    nextStops: ["Korona (12:10)", "Smolki (12:12)", "Rzemieślnicza (12:14)"],
  },
  {
    id: "5",
    type: "bus",
    line: "173",
    destination: "Nowy Bieżanów",
    delay: 8,
    position: [50.06, 19.925], // Muzeum Narodowe
    nextStops: [
      "AGH / UR (12:15)",
      "Muzeum Narodowe (12:17)",
      "Jubilat (12:20)",
    ],
  },
];

const useVehicles = () => {
  const [vehicles, setVehicles] = useState(mockVehicles);

  // In a real application, you would fetch the data from an API here.
  // For example:
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     fetch('YOUR_API_ENDPOINT')
  //       .then(response => response.json())
  //       .then(data => setVehicles(data));
  //   }, 5000); // Fetch every 5 seconds
  //
  //   return () => clearInterval(interval);
  // }, []);

  // For this example, we'll just simulate vehicle movement.
  useEffect(() => {
    const interval = setInterval(() => {
      setVehicles((prevVehicles) =>
        prevVehicles.map((v) => ({
          ...v,
          position: [
            v.position[0] + (Math.random() - 0.5) * 0.001,
            v.position[1] + (Math.random() - 0.5) * 0.001,
          ],
        })),
      );
    }, 2000); // Update every 2 seconds

    return () => clearInterval(interval);
  }, []);

  return { vehicles, routes: mockRoutes, stops: mockStops };
};

export default useVehicles;

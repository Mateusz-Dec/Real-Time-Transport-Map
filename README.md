# Real-time Transport Map (Krakow)

Aplikacja webowa stworzona w React, służąca do wizualizacji transportu publicznego w Krakowie na żywo (dane symulowane).

## Funkcjonalności

- **Mapa na żywo**: Wyświetla pozycje pojazdów na mapie Krakowa.
- **Płynny ruch**: Animacja ruchu pojazdów wzdłuż zdefiniowanych tras.
- **Planer podróży**: Wyznaczanie bezpośrednich połączeń między przystankami.
- **Filtrowanie i wyszukiwanie**: Zaawansowane opcje filtrowania (typ pojazdu, niskopodłogowość) oraz inteligentna wyszukiwarka linii i przystanków.
- **Ulubione**: Możliwość dodawania linii do ulubionych.
- **Szczegóły**: Dymki z informacjami o pojazdach (opóźnienie, dostępność) i przystankach (rozkład jazdy).
- **Warstwy mapy**: Przełącznik widoku mapy (jasna, ciemna, satelitarna, terenowa) oraz warstwa torów kolejowych.
- **Interaktywność**:
  - Wyświetlanie trasy po kliknięciu w pojazd lub wybraniu linii.
  - Centrowanie mapy na wybranym przystanku.
  - Przycisk "Moja lokalizacja" i "Resetuj widok".
- **UI/UX**:
  - Tryb ciemny dla całej aplikacji.
  - Klastrowanie przystanków dla lepszej czytelności.
  - Zwijany panel boczny i responsywny design dla urządzeń mobilnych.

## Technologie

- React
- Leaflet / React-Leaflet (mapy)
- Vite (narzędzie budujące)
- React-Leaflet-Cluster (grupowanie znaczników)
- leaflet.markercluster

## Uruchomienie

1.  `npm install`
2.  `npm run dev`

## 🚀 Demo

**Live Demo**: https://real-time-transport-map.vercel.app/

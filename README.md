# Real-time Transport Map (Krakow)

Aplikacja webowa stworzona w React, służąca do wizualizacji transportu publicznego w Krakowie na żywo (dane symulowane).

## Funkcjonalności

- **Mapa na żywo**: Wyświetla aktualne pozycje tramwajów i autobusów na mapie Krakowa.
- **Śledzenie pojazdów**: Płynna animacja ruchu pojazdów wzdłuż zdefiniowanych tras.
- **Filtrowanie**: Możliwość filtrowania widocznych pojazdów (wszystkie, autobusy, tramwaje).
- **Wyszukiwanie**: Wyszukiwarka linii z podpowiedziami.
- **Szczegóły pojazdu**: Po kliknięciu w pojazd wyświetla się dymek z informacjami o linii, kierunku i opóźnieniu.
- **Przystanki**: Wyświetlanie przystanków na mapie. Po kliknięciu w przystanek mapa centruje się na nim, a dymek pokazuje najbliższe odjazdy.
- **Trasy**: Po wybraniu linii na mapie rysowana jest jej trasa.
- **Lokalizacja**: Przycisk do namierzania lokalizacji użytkownika.
- **Tryb ciemny**: Przełącznik motywu jasnego/ciemnego dla mapy i interfejsu.
- **Responsywność**: Panel boczny można zwijać, aby odsłonić więcej mapy.

## Technologie

- React
- Leaflet / React-Leaflet (mapy)
- Vite (narzędzie budujące)

## Uruchomienie

1.  `npm install`
2.  `npm run dev`

## 🚀 Demo

**Live Demo**: https://real-time-transport-map.vercel.app/

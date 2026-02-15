import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import "leaflet/dist/leaflet.css";

// Ustawienie favicony dynamicznie
const faviconUrl =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23007bff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M19 17h2l.64-2.54c.24-.959.24-1.962.24-1.962H2.12s0 1 .24 1.962L3 17h2'/%3E%3Cpath d='M16 17h-8'/%3E%3Cpath d='M4 17v3h2v-3'/%3E%3Cpath d='M18 17v3h2v-3'/%3E%3Cpath d='M17 11H7V8a5 5 0 0 1 10 0v3z'/%3E%3C/svg%3E";
const link =
  document.querySelector("link[rel*='icon']") || document.createElement("link");
link.type = "image/svg+xml";
link.rel = "shortcut icon";
link.href = faviconUrl;
document.getElementsByTagName("head")[0].appendChild(link);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

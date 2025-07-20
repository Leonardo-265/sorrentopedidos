import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import Cocina from "./Cocina.jsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./styles.css"; // (opcional, creá estilos extra si querés)

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/cocina" element={<Cocina />} />
    </Routes>
  </BrowserRouter>
);

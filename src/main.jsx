import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Cliente from './pages/Cliente'
import Cocina from './pages/Cocina'
import Inicio from './pages/Inicio'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/menu" element={<Cliente />} />
        <Route path="/cocina" element={<Cocina />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
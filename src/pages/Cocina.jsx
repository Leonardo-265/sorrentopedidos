import React, { useEffect, useState, useRef } from "react";
import Historial from "./Historial.jsx";

export default function Cocina() {
  const [mostrarHistorial, setMostrarHistorial] = useState(false);
  const [pedidos, setPedidos] = useState([]);
  const [mostrarSoloPendientes, setMostrarSoloPendientes] = useState(false);
  const [error, setError] = useState(null);
  const [toastVisible, setToastVisible] = useState(false);
  const sonidoRef = useRef(null);
  const cantidadAnteriorRef = useRef(0);

  // Cargar sonido
  useEffect(() => {
    sonidoRef.current = new Audio("/sound/campana.mp3");
  }, []);

  // Mostrar notificación
  const mostrarNotificacion = () => {
    setToastVisible(true);
    if (sonidoRef.current) sonidoRef.current.play();
    setTimeout(() => setToastVisible(false), 3000);
  };

  const cargarPedidos = () => {
    try {
      const pedidosGuardados = localStorage.getItem("pedidosCocina");
      if (pedidosGuardados) {
        const pedidosParseados = JSON.parse(pedidosGuardados);
        if (Array.isArray(pedidosParseados)) {
          if (pedidosParseados.length > cantidadAnteriorRef.current) {
            mostrarNotificacion();
          }
          cantidadAnteriorRef.current = pedidosParseados.length;
          setPedidos(pedidosParseados);
        } else {
          setPedidos([]);
        }
      } else {
        setPedidos([]);
      }
    } catch (error) {
      console.error("Error al cargar pedidos:", error);
      setError("Error al cargar pedidos");
    }
  };

  useEffect(() => {
    cargarPedidos();
    const interval = setInterval(() => {
      cargarPedidos();
    }, 2000);

    const listener = (e) => {
      if (e.key === "pedidosCocina") {
        cargarPedidos();
      }
    };
    window.addEventListener("storage", listener);

    return () => {
      clearInterval(interval);
      window.removeEventListener("storage", listener);
    };
  }, []);

  const convertirHoraAFecha = (horaString) => {
    const hoy = new Date().toISOString().split("T")[0];
    return new Date(`${hoy}T${horaString}`);
  };

  const actualizarEstadoPedido = (index, nuevoEstado) => {
    const nuevosPedidos = [...pedidos];
    const pedidoActual = nuevosPedidos[index];
    pedidoActual.estado = nuevoEstado;

    if (nuevoEstado === "listo") {
      const historial = JSON.parse(localStorage.getItem("historialPedidos") || "[]");
      historial.push({ ...pedidoActual, fecha: new Date().toLocaleString() });
      localStorage.setItem("historialPedidos", JSON.stringify(historial));
      nuevosPedidos.splice(index, 1);
    }

    setPedidos(nuevosPedidos);
    localStorage.setItem("pedidosCocina", JSON.stringify(nuevosPedidos));
    cantidadAnteriorRef.current = nuevosPedidos.length;
  };

  const pedidosFiltrados = (mostrarSoloPendientes
    ? pedidos.filter((p) => p.estado === "pendiente")
    : pedidos
  ).sort((a, b) => convertirHoraAFecha(b.hora) - convertirHoraAFecha(a.hora));

  return (
    <div className="p-4 relative">
      <h1 className="text-2xl font-bold mb-4">👨‍🍳 Panel de Cocina</h1>

      <div className="flex gap-4 flex-wrap mb-4">
        <button
          className="bg-yellow-300 hover:bg-yellow-400 px-4 py-2 rounded shadow"
          onClick={() => setMostrarHistorial(!mostrarHistorial)}
        >
          📜 Ver historial de pedidos
        </button>

        <button
          className={`px-4 py-2 rounded shadow ${
            mostrarSoloPendientes
              ? "bg-blue-600 text-white"
              : "bg-gray-300 hover:bg-gray-400"
          }`}
          onClick={() => setMostrarSoloPendientes(!mostrarSoloPendientes)}
        >
          {mostrarSoloPendientes ? "🔁 Ver todos" : "🕓 Ver solo pendientes"}
        </button>
      </div>

      {mostrarHistorial && <Historial />}
      {error && <p className="text-red-500">{error}</p>}

      {toastVisible && (
        <div className="fixed top-5 right-5 bg-green-600 text-white px-4 py-2 rounded shadow-lg z-50">
          📦 ¡Nuevo pedido recibido!
        </div>
      )}

      {pedidosFiltrados.length === 0 ? (
        <p>No hay pedidos en este momento.</p>
      ) : (
        pedidosFiltrados.map((p, index) => (
          <div key={index} className="border p-4 mb-4 rounded shadow">
            <p>📦 <strong>Estado:</strong> {p.estado}</p>
            <p>⏰ <strong>Hora:</strong> {p.hora}</p>
            <p>👨‍🍳 <strong>Cliente:</strong> {p.cliente?.nombre || "No especificado"}</p>
            <p>📞 <strong>Teléfono:</strong> {p.cliente?.telefono || "No especificado"}</p>
            <p>📍 <strong>Dirección:</strong> {p.cliente?.direccion || "No especificada"}</p>

            <p>🛒 <strong>Pedido:</strong></p>
            <ul>
              {Array.isArray(p.pedido) && p.pedido.length > 0 ? (
                p.pedido.map((item, i) => (
                  <li key={i}>• {item.nombre} - ${item.precio}</li>
                ))
              ) : (
                <li>• Sin items</li>
              )}
            </ul>

            <p><strong>Total:</strong> ${Array.isArray(p.pedido) ? p.pedido.reduce((acc, item) => acc + item.precio, 0) : 0}</p>

            <div className="mt-3 flex gap-2">
              <button
                className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded"
                onClick={() => actualizarEstadoPedido(index, "en preparación")}
              >
                🟡 En preparación
              </button>
              <button
                className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                onClick={() => actualizarEstadoPedido(index, "listo")}
              >
                ✅ Listo
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

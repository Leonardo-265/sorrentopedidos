import React, { useEffect, useState } from "react";
import Historial from "../Historial.jsx";

export default function Cocina() {
  const [mostrarHistorial, setMostrarHistorial] = useState(false);
  const [pedidos, setPedidos] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cargarPedidos = () => {
      try {
        // Verificar si localStorage está disponible
        if (typeof Storage === "undefined") {
          setError("LocalStorage no está disponible");
          return;
        }

        const pedidosGuardados = localStorage.getItem("pedidosCocina");
        
        if (pedidosGuardados) {
          const pedidosParseados = JSON.parse(pedidosGuardados);
          // Validar que sea un array
          if (Array.isArray(pedidosParseados)) {
            setPedidos(pedidosParseados);
          } else {
            console.warn("Los datos guardados no son un array válido");
            setPedidos([]);
          }
        } else {
          setPedidos([]);
        }
      } catch (error) {
        console.error("Error al cargar pedidos:", error);
        setError("Error al cargar los pedidos guardados");
        setPedidos([]);
      }
    };

    cargarPedidos();

    // Escuchar cambios en localStorage (útil si otros componentes modifican los datos)
    const handleStorageChange = (e) => {
      if (e.key === "pedidosCocina") {
        cargarPedidos();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    // Cleanup del event listener
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  if (mostrarHistorial) {
    return <Historial volver={() => setMostrarHistorial(false)} />;
  }

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">👨‍🍳 Panel de Cocina</h1>

      <button
        onClick={() => setMostrarHistorial(true)}
        className="mb-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        📜 Ver historial de pedidos
      </button>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {pedidos.length === 0 ? (
        <p className="text-gray-600">No hay pedidos por preparar.</p>
      ) : (
        <div className="space-y-4">
          {pedidos.map((pedido, index) => (
            <div
              key={pedido.id || index} // Usar ID único si está disponible
              className="bg-white border rounded shadow p-4"
            >
              <p><strong>🧑 Cliente:</strong> {pedido.cliente?.nombre || "No especificado"}</p>
              <p><strong>📞 Teléfono:</strong> {pedido.cliente?.telefono || "No especificado"}</p>
              <p><strong>📍 Dirección:</strong> {pedido.cliente?.direccion || "No especificada"}</p>
              <p><strong>🛒 Pedido:</strong></p>
              <ul className="list-disc pl-6">
                {pedido.items?.map((item, i) => (
                  <li key={i}>
                    {item.nombre || "Producto"} - ${item.precio || 0} x {item.cantidad || 1}
                  </li>
                )) || <li>Sin items</li>}
              </ul>
              <p><strong>💵 Total:</strong> ${pedido.total || 0}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
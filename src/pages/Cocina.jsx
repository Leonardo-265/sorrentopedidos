import React, { useEffect, useState } from "react";
import Historial from "./historial.jsx";

export default function Cocina() {
  const [mostrarHistorial, setMostrarHistorial] = useState(false);
  const [pedidos, setPedidos] = useState([]);

  useEffect(() => {
    const pedidosGuardados = JSON.parse(localStorage.getItem("pedidosCocina")) || [];
    setPedidos(pedidosGuardados);
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

      {pedidos.length === 0 ? (
        <p className="text-gray-600">No hay pedidos por preparar.</p>
      ) : (
        <div className="space-y-4">
          {pedidos.map((pedido, index) => (
            <div
              key={index}
              className="bg-white border rounded shadow p-4"
            >
              <p><strong>🧑 Cliente:</strong> {pedido.cliente.nombre}</p>
              <p><strong>📞 Teléfono:</strong> {pedido.cliente.telefono}</p>
              <p><strong>📍 Dirección:</strong> {pedido.cliente.direccion}</p>
              <p><strong>🛒 Pedido:</strong></p>
              <ul className="list-disc pl-6">
                {pedido.items.map((item, i) => (
                  <li key={i}>
                    {item.nombre} - ${item.precio} x {item.cantidad}
                  </li>
                ))}
              </ul>
              <p><strong>💵 Total:</strong> ${pedido.total}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function Historial({ volver }) {
  const [pedidos, setPedidos] = useState([]);

  useEffect(() => {
    async function obtenerPedidos() {
      const { data, error } = await supabase
        .from("pedidos")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error al obtener pedidos:", error.message);
      } else {
        setPedidos(data);
      }
    }

    obtenerPedidos();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">📜 Historial de Pedidos</h1>

      <button
        className="mb-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        onClick={volver}
      >
        🔙 Volver a Cocina
      </button>

      {pedidos.length === 0 ? (
        <p>No hay pedidos guardados.</p>
      ) : (
        <div className="space-y-4">
          {pedidos.map((pedido) => (
            <div
              key={pedido.id}
              className="border rounded p-4 shadow bg-white"
            >
              <p><strong>🧑 Cliente:</strong> {pedido.nombre}</p>
              <p><strong>📞 Teléfono:</strong> {pedido.telefono}</p>
              <p><strong>📍 Dirección:</strong> {pedido.direccion}</p>
              <p><strong>🛒 Pedido:</strong> {pedido.detalle}</p>
              <p><strong>💵 Total:</strong> ${pedido.total}</p>
              <p className="text-sm text-gray-500">
                📅 {new Date(pedido.created_at).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

import React, { useEffect, useState, useRef } from "react";
import Historial from "./Historial.jsx";
import { supabase } from '../supabaseClient';

export default function Cocina() {
  const [mostrarHistorial, setMostrarHistorial] = useState(false);
  const [pedidos, setPedidos] = useState([]);
  const [mostrarSoloPendientes, setMostrarSoloPendientes] = useState(false);
  const [error, setError] = useState(null);
  const [toastVisible, setToastVisible] = useState(false);
  const sonidoRef = useRef(null);
  const cantidadAnteriorRef = useRef(0);
  const [filtro, setFiltro] = useState('pendiente');
  const [historial, setHistorial] = useState([]);

  // Cargar sonido
  useEffect(() => {
    sonidoRef.current = new Audio("/sounds/campana.mp3");
    const desbloquearSonido = () => {
      if (sonidoRef.current) {
        sonidoRef.current.play().catch(() => {});
      }
      window.removeEventListener('click', desbloquearSonido);
    };
    window.addEventListener('click', desbloquearSonido);
    return () => window.removeEventListener('click', desbloquearSonido);
  }, []);

  // Mostrar notificación
  const mostrarNotificacion = () => {
    setToastVisible(true);
    if (sonidoRef.current) sonidoRef.current.play();
    setTimeout(() => setToastVisible(false), 3000);
  };

  const cargarPedidos = async () => {
    try {
      const { data, error } = await supabase
        .from('pedidos')
        .select('*')
        .order('id', { ascending: false });
      if (error) throw error;
      setPedidos(data || []);
    } catch (error) {
      setError("Error al cargar pedidos");
      console.error(error);
    }
  };

  const cargarHistorial = async () => {
    try {
      const { data, error } = await supabase
        .from('historial_pedidos')
        .select('*')
        .order('id', { ascending: false });
      if (error) throw error;
      setHistorial(data || []);
    } catch (error) {
      setError("Error al cargar historial");
      console.error(error);
    }
  };

  useEffect(() => {
    if (filtro === 'historial') {
      cargarHistorial();
    } else {
      cargarPedidos();
    }
    const interval = setInterval(() => {
      if (filtro === 'historial') {
        cargarHistorial();
      } else {
        cargarPedidos();
      }
    }, 2000);
    return () => {
      clearInterval(interval);
    };
  }, [filtro]);

  useEffect(() => {
    console.log("Pedidos leídos en Cocina:", pedidos);
  }, [pedidos]);

  useEffect(() => {
    if (pedidos.length > cantidadAnteriorRef.current) {
      mostrarNotificacion();
    }
    cantidadAnteriorRef.current = pedidos.length;
  }, [pedidos]);

  const convertirHoraAFecha = (horaString) => {
    const hoy = new Date().toISOString().split("T")[0];
    return new Date(`${hoy}T${horaString}`);
  };

  const actualizarEstadoPedido = async (id, nuevoEstado, pedidoObj) => {
    if (nuevoEstado === "listo") {
      // Copia el pedido pero sin el campo id
      const { id, ...pedidoSinId } = pedidoObj;
      const { error: insertError } = await supabase.from('historial_pedidos').insert([
        {
          ...pedidoSinId,
          estado: "listo",
          fecha_finalizado: new Date().toISOString()
        }
      ]);
      if (insertError) {
        console.error("Error insertando en historial:", insertError);
        return;
      }
      // Eliminar de pedidos
      const { error: deleteError } = await supabase.from('pedidos').delete().eq('id', id);
      if (deleteError) {
        console.error("Error eliminando de pedidos:", deleteError);
      } else {
        console.log("Pedido eliminado correctamente de pedidos:", id);
      }
      cargarPedidos();
    } else {
      await supabase.from('pedidos').update({ estado: nuevoEstado }).eq('id', id);
      cargarPedidos();
    }
  };

  const pedidosFiltrados = filtro === 'historial'
    ? historial
    : pedidos.filter((p) => p.estado === filtro);

  return (
    <div className="p-4 relative">
      <h1 className="text-2xl font-bold mb-4">👨‍🍳 Panel de Cocina</h1>

      <div className="flex gap-4 flex-wrap mb-4">
        <button
          className={`px-4 py-2 rounded shadow ${filtro === 'pendiente' ? 'bg-blue-600 text-white' : 'bg-gray-300 hover:bg-gray-400'}`}
          onClick={() => setFiltro('pendiente')}
        >
          🆕 Nuevo pedido
        </button>
        <button
          className={`px-4 py-2 rounded shadow ${filtro === 'en preparación' ? 'bg-blue-600 text-white' : 'bg-gray-300 hover:bg-gray-400'}`}
          onClick={() => setFiltro('en preparación')}
        >
          🛠️ En preparación
        </button>
        <button
          className={`px-4 py-2 rounded shadow ${filtro === 'historial' ? 'bg-blue-600 text-white' : 'bg-gray-300 hover:bg-gray-400'}`}
          onClick={() => setFiltro('historial')}
        >
          📜 Historial
        </button>
      </div>

      {mostrarHistorial && <Historial />}
      {error && <p className="text-red-500">{error}</p>}

      {toastVisible && (
        <div className="fixed top-6 right-6 bg-green-600 text-white px-6 py-4 rounded-xl shadow-2xl z-50 text-lg font-semibold animate-fade-in transition-opacity">
          📦 ¡Nuevo pedido recibido!
        </div>
      )}

      {pedidosFiltrados.length === 0 ? (
        <p>No hay pedidos en este momento.</p>
      ) : (
        pedidosFiltrados.map((p) => (
          <div key={p.id} className="border p-4 mb-4 rounded shadow">
            <p>📦 <strong>Estado:</strong> {p.estado}</p>
            <p>⏰ <strong>Hora:</strong> {p.hora}</p>
            <p>👨‍🍳 <strong>Cliente:</strong> {p.cliente?.nombre || "No especificado"}</p>
            <p>📞 <strong>Teléfono:</strong> {p.cliente?.telefono || "No especificado"}</p>
            <p>📍 <strong>Observaciones:</strong> {p.cliente?.observaciones || "Sin observaciones"}</p>

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

            {filtro !== 'historial' && (
              <div className="mt-3 flex gap-2">
                <button
                  className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded"
                  onClick={() => actualizarEstadoPedido(p.id, "en preparación", p)}
                >
                  🟡 En preparación
                </button>
                <button
                  className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                  onClick={() => actualizarEstadoPedido(p.id, "listo", p)}
                >
                  ✅ Listo
                </button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}

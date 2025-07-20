import React, { useEffect, useState, useRef } from "react";
import { supabase } from "./supabaseClient";

export default function Cocina() {
  const [pedidos, setPedidos] = useState([]);
  const [showNuevoPedido, setShowNuevoPedido] = useState(false);
  const [estadoFiltro, setEstadoFiltro] = useState("pendiente");
  const sonidoRef = useRef(null);

  useEffect(() => {
    fetchPedidos();

    const channel = supabase
      .channel("pedidos-channel")
      .on("postgres_changes", {
        event: "INSERT",
        schema: "public",
        table: "pedidos"
      }, () => {
        fetchPedidos();
        if (sonidoRef.current) sonidoRef.current.play();
        setShowNuevoPedido(true);
        setTimeout(() => setShowNuevoPedido(false), 4000);
      })
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, []);

  const fetchPedidos = async () => {
    const { data, error } = await supabase.from("pedidos").select("*").order("fecha", { ascending: false });
    if (!error) setPedidos(data);
  };

  const cambiarEstado = async (id, nuevoEstado) => {
    await supabase.from("pedidos").update({ estado: nuevoEstado }).eq("id", id);
    fetchPedidos();
  };

  const renderPedidos = (estado) => {
    const pedidosFiltrados = pedidos.filter(p => p.estado === estado);
    return (
      <div style={{ marginBottom: 50 }}>
        {pedidosFiltrados.length === 0 && <div>No hay pedidos en este estado.</div>}
        {pedidosFiltrados.map((p) => {
          let carritoItems = [];
          try {
            carritoItems = typeof p.carrito === "string" ? JSON.parse(p.carrito) : p.carrito;
          } catch {
            carritoItems = [];
          }

          return (
            <div key={p.id} style={{
              margin: "12px 0", padding: 14, background: "#fff7ee", borderRadius: 10, boxShadow: "1px 2px 6px #ffc470"
            }}>
              <b>{p.cliente_nombre}</b> ({p.cliente_telefono})<br />
              <b>Dirección:</b> {p.cliente_direccion}<br />
              <b>Pago:</b> {p.cliente_pago}<br />
              <b>Horario:</b> {p.cliente_horario}<br />
              <b>Observaciones:</b> {p.cliente_obs || "-"}<br />
              <b>Pedido:</b>
              <ul>
                {carritoItems.map((item, i) => (
                  <li key={i}>{item.nombre} {item.sabor ? `(${item.sabor})` : ""} x{item.cantidad} - ${item.precio * item.cantidad}</li>
                ))}
              </ul>
              <b>Total:</b> ${p.total}
              <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
                {p.estado === "pendiente" && (
                  <button onClick={() => cambiarEstado(p.id, "en preparación")} style={btn}>En preparación</button>
                )}
                {p.estado === "en preparación" && (
                  <>
                    <button onClick={() => cambiarEstado(p.id, "pendiente")} style={btnSec}>← Pendiente</button>
                    <button onClick={() => cambiarEstado(p.id, "listo")} style={btn}>✅ Listo</button>
                  </>
                )}
                {p.estado === "listo" && (
                  <button onClick={() => cambiarEstado(p.id, "en preparación")} style={btnSec}>← Preparación</button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const btn = { background: "#10b981", color: "#fff", padding: "6px 12px", borderRadius: 6, border: "none", cursor: "pointer" };
  const btnSec = { background: "#f59e0b", color: "#fff", padding: "6px 12px", borderRadius: 6, border: "none", cursor: "pointer" };

  return (
    <div style={{ padding: 40, maxWidth: 900, margin: "0 auto", position: "relative" }}>
      <h2>Panel de Cocina</h2>

      {/* BOTONES DE FILTRO */}
      <div style={{ display: "flex", gap: 10, marginBottom: 30 }}>
        {["pendiente", "en preparación", "listo"].map((estado) => (
          <button
            key={estado}
            onClick={() => setEstadoFiltro(estado)}
            style={{
              padding: "8px 14px",
              borderRadius: 8,
              border: "none",
              fontWeight: "bold",
              background: estadoFiltro === estado ? "#10b981" : "#f1f1f1",
              color: estadoFiltro === estado ? "#fff" : "#333",
              cursor: "pointer",
              boxShadow: "0 1px 4px rgba(0,0,0,0.1)"
            }}
          >
            {estado.toUpperCase()}
          </button>
        ))}
      </div>

      {/* LISTA DE PEDIDOS */}
      {renderPedidos(estadoFiltro)}

      {/* 🔔 SONIDO */}
      <audio ref={sonidoRef} src="/sounds/campana.mp3" preload="auto" />

      {/* 🟨 CARTEL FLOTANTE */}
      {showNuevoPedido && (
        <div style={{
          position: "fixed",
          top: 30,
          right: 30,
          background: "#10b981",
          color: "#fff",
          padding: "12px 20px",
          borderRadius: 10,
          fontWeight: "bold",
          boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
          zIndex: 1000
        }}>
          ¡Nuevo pedido recibido!
        </div>
      )}

      <a href="/" style={{ display: "block", marginTop: 40 }}>← Volver</a>
    </div>
  );
}

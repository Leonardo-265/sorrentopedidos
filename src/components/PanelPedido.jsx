import React from "react";

export default function PanelPedido({ pedido, setPedido, datosCliente }) {
  const total = pedido.reduce((acc, p) => acc + p.precio * p.cantidad, 0);

  const eliminarProducto = (nombre) => {
    setPedido(pedido.filter((p) => p.nombre !== nombre));
  };

  return (
    <div className="pedido-panel">
      <h3>Pedido</h3>
      {pedido.map((p) => (
        <div key={p.nombre} className="pedido-item">
          <span>
            {p.nombre} x{p.cantidad} - ${p.precio * p.cantidad}
          </span>
          <button onClick={() => eliminarProducto(p.nombre)}>Eliminar</button>
        </div>
      ))}
      <div className="total">TOTAL: ${total}</div>
    </div>
  );
}

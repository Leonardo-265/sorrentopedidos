import React from "react";

export default function PanelProductos({ productos, pedido, setPedido }) {
  const agregarProducto = (producto) => {
    const existe = pedido.find((p) => p.nombre === producto.nombre);
    if (existe) {
      setPedido(
        pedido.map((p) =>
          p.nombre === producto.nombre
            ? { ...p, cantidad: p.cantidad + 1 }
            : p
        )
      );
    } else {
      setPedido([...pedido, { ...producto, cantidad: 1 }]);
    }
  };

  return (
    <div className="productos-grid">
      {productos.map((prod) => (
        <button
          key={prod.nombre}
          className="prod-btn"
          onClick={() => agregarProducto(prod)}
        >
          <div><b>{prod.nombre}</b></div>
          <div>{prod.sabor}</div>
          <div><b>${prod.precio}</b></div>
        </button>
      ))}
    </div>
  );
}

import React, { useState, useEffect } from "react";
import productosData from "../productos.json";
import { supabase } from "../supabaseClient";

function Cliente() {
  const [pedido, setPedido] = useState([]);
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [direccion, setDireccion] = useState("");

  // Agrupar productos por categoría
  const categorias = [...new Set(productosData.map((p) => p.categoria))];

  const productosPorCategoria = categorias.map((cat) => ({
    categoria: cat,
    productos: productosData.filter((p) => p.categoria === cat),
  }));

  const agregarProducto = (producto) => {
    setPedido((prev) => [...prev, producto]);
  };

  const eliminarProducto = (index) => {
    setPedido((prev) => prev.filter((_, i) => i !== index));
  };

  const total = pedido.reduce((sum, p) => sum + p.precio, 0);

  const confirmarPedido = async () => {
    if (!nombre || !telefono || !direccion || pedido.length === 0) {
      alert("Completá tus datos y agregá al menos un producto.");
      return;
    }

    const { error } = await supabase.from("pedidos").insert([
      {
        nombre,
        telefono,
        direccion,
        detalle: pedido.map((p) => p.nombre).join(", "),
        total,
        estado: "pendiente",
      },
    ]);

    if (error) {
      alert("Hubo un error al guardar el pedido.");
      console.error(error);
    } else {
      alert("¡Pedido confirmado!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 p-4 md:flex md:gap-4">
      {/* Productos */}
      <div className="md:w-2/3">
        <h1 className="text-2xl font-bold mb-4">Menú</h1>
        {productosPorCategoria.map(({ categoria, productos }) => (
          <div key={categoria} className="mb-6">
            <h2 className="text-xl font-semibold mb-2">{categoria}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {productos.map((producto, index) => (
                <button
                  key={index}
                  onClick={() => agregarProducto(producto)}
                  className="bg-white p-4 rounded-lg shadow hover:bg-gray-50 text-left"
                >
                  <h3 className="font-medium">{producto.nombre}</h3>
                  <p className="text-sm text-gray-500">
                    ${producto.precio.toLocaleString()}
                  </p>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Pedido */}
      <div className="md:w-1/3 bg-white rounded-lg shadow p-4 mt-6 md:mt-0">
        <h2 className="text-xl font-semibold mb-4">Tu Pedido</h2>

        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="w-full mb-2 p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Teléfono"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
          className="w-full mb-2 p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Dirección"
          value={direccion}
          onChange={(e) => setDireccion(e.target.value)}
          className="w-full mb-4 p-2 border rounded"
        />

        <ul className="mb-4">
          {pedido.map((item, index) => (
            <li key={index} className="flex justify-between items-center mb-1">
              <span>{item.nombre}</span>
              <span>${item.precio}</span>
              <button
                onClick={() => eliminarProducto(index)}
                className="text-red-500 ml-2"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>

        <div className="font-bold mb-4">Total: ${total.toLocaleString()}</div>

        <button
          onClick={confirmarPedido}
          className="bg-green-600 text-white w-full py-2 rounded hover:bg-green-700"
        >
          Confirmar pedido
        </button>
      </div>
    </div>
  );
}

export default Cliente;

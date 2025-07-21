import React, { useState } from "react";
import productos from "../productos.json";

function Cliente() {
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [subcategoriaSeleccionada, setSubcategoriaSeleccionada] = useState(null);
  const [pedido, setPedido] = useState([]);

  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [direccion, setDireccion] = useState("");

  const categorias = [...new Set(productos.map(p => p.categoria))];
  const subcategorias = categoriaSeleccionada
    ? [...new Set(productos.filter(p => p.categoria === categoriaSeleccionada).map(p => p.subcategoria))]
    : [];
  const productosFiltrados = subcategoriaSeleccionada
    ? productos.filter(p => p.categoria === categoriaSeleccionada && p.subcategoria === subcategoriaSeleccionada)
    : [];

  const agregarProducto = (producto) => {
    setPedido([...pedido, producto]);
  };

 const guardarPedidoCocinaLocal = (pedido) => {
  if (!nombre || !telefono || !direccion) {
    alert("Por favor, completá los datos del cliente.");
    return;
  }
  if (pedido.length === 0) {
    alert("No hay productos en el pedido.");
    return;
  }

  const pedidos = JSON.parse(localStorage.getItem("pedidosCocina") || "[]");
  pedidos.push({
    pedido,
    cliente: {
      nombre,
      telefono,
      direccion,
    },
    hora: new Date().toLocaleTimeString(),
    estado: "pendiente",
  });
  localStorage.setItem("pedidosCocina", JSON.stringify(pedidos));
};

  const total = pedido.reduce((acc, prod) => acc + prod.precio, 0);

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">Sorrento Pedidos</h1>

      {/* Datos del cliente */}
      <div className="mb-6 bg-yellow-100 p-4 rounded shadow-md">
        <h2 className="text-lg font-semibold mb-2">Datos del Cliente</h2>
        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="w-full mb-2 px-3 py-2 border rounded"
        />
        <input
          type="tel"
          placeholder="Teléfono"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
          className="w-full mb-2 px-3 py-2 border rounded"
        />
        <input
          type="text"
          placeholder="Dirección"
          value={direccion}
          onChange={(e) => setDireccion(e.target.value)}
          className="w-full mb-2 px-3 py-2 border rounded"
        />
      </div>

      {/* Categorías */}
      <div className="mb-4 flex flex-wrap gap-2 justify-center">
        {categorias.map((cat) => (
          <button
            key={cat}
            className="bg-orange-400 hover:bg-orange-500 text-white px-4 py-2 rounded shadow-md"
            onClick={() => {
              setCategoriaSeleccionada(cat);
              setSubcategoriaSeleccionada(null);
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Subcategorías */}
      {subcategorias.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-2 justify-center">
          {subcategorias.map((sub) => (
            <button
              key={sub}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded shadow-md"
              onClick={() => setSubcategoriaSeleccionada(sub)}
            >
              {sub}
            </button>
          ))}
        </div>
      )}

      {/* Productos */}
      {productosFiltrados.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-2 justify-center">
          {productosFiltrados.map((prod, i) => (
            <button
              key={i}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded shadow-md"
              onClick={() => agregarProducto(prod)}
            >
              {prod.nombre} - ${prod.precio}
            </button>
          ))}
        </div>
      )}

      {/* Pedido */}
      {pedido.length > 0 && (
        <div className="mt-6 bg-gray-100 p-4 rounded shadow-md">
          <h2 className="text-xl font-semibold mb-2">Pedido Actual:</h2>
          <ul className="list-disc pl-5">
            {pedido.map((item, idx) => (
              <li key={idx}>{item.nombre} - ${item.precio}</li>
            ))}
          </ul>
          <p className="mt-2 font-bold">Total: ${total}</p>

          <button
            className="mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
            onClick={() => {
              if (!nombre || !telefono || !direccion) {
                alert("Por favor, completá los datos del cliente.");
                return;
              }
              guardarPedidoCocinaLocal(pedido);
              setPedido([]);
              setNombre("");
              setTelefono("");
              setDireccion("");
              alert("¡Pedido confirmado!");
            }}
          >
            Confirmar Pedido
          </button>
        </div>
      )}
    </div>
  );
}

export default Cliente;

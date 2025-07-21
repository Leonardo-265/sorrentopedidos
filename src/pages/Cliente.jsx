import React, { useState } from "react";
import productos from "../productos.json";

function Cliente() {
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [subcategoriaSeleccionada, setSubcategoriaSeleccionada] = useState(null);
  const [pedido, setPedido] = useState([]);

  const [nombre, setNombre] = useState("");
  const [direccion, setDireccion] = useState("");
  const [telefono, setTelefono] = useState("");

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

  const total = pedido.reduce((acc, prod) => acc + prod.precio, 0);

  const confirmarPedido = () => {
    const resumen = {
      cliente: { nombre, direccion, telefono },
      pedido,
      total,
      fecha: new Date().toLocaleString()
    };
    localStorage.setItem("pedidoCliente", JSON.stringify(resumen));
    alert("¡Pedido confirmado!");
    setPedido([]);
    setNombre("");
    setDireccion("");
    setTelefono("");
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">Sorrento Pedidos</h1>

      {/* CATEGORÍAS */}
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

      {/* SUBCATEGORÍAS */}
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

      {/* PRODUCTOS */}
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

      {/* PEDIDO ACTUAL */}
      {pedido.length > 0 && (
        <div className="mt-6 bg-gray-100 p-4 rounded shadow-md">
          <h2 className="text-xl font-semibold mb-2">Pedido Actual:</h2>
          <ul className="list-disc pl-5">
            {pedido.map((item, idx) => (
              <li key={idx}>{item.nombre} - ${item.precio}</li>
            ))}
          </ul>
          <p className="mt-2 font-bold">Total: ${total}</p>
        </div>
      )}

      {/* FORMULARIO DE DATOS Y CONFIRMACIÓN */}
      {pedido.length > 0 && (
        <div className="mt-6 bg-white p-4 rounded shadow-md">
          <h2 className="text-xl font-semibold mb-2">Tus Datos</h2>
          <input
            type="text"
            placeholder="Nombre"
            className="block w-full mb-2 p-2 border rounded"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
          <input
            type="text"
            placeholder="Dirección"
            className="block w-full mb-2 p-2 border rounded"
            value={direccion}
            onChange={(e) => setDireccion(e.target.value)}
          />
          <input
            type="tel"
            placeholder="Teléfono"
            className="block w-full mb-2 p-2 border rounded"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
          />
          <button
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
            onClick={confirmarPedido}
          >
            Confirmar Pedido
          </button>
        </div>
      )}
    </div>
  );
}

export default Cliente;

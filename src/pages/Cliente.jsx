import React, { useState } from "react";
import productos from "../productos.json";
import { supabase } from '../supabaseClient';

function Cliente() {
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [subcategoriaSeleccionada, setSubcategoriaSeleccionada] = useState(null);
  const [pedido, setPedido] = useState([]);

  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [observacionProducto, setObservacionProducto] = useState("");

  const categorias = [...new Set(productos.map((p) => p.categoria))];
  const subcategorias = categoriaSeleccionada
    ? [...new Set(productos.filter((p) => p.categoria === categoriaSeleccionada).map((p) => p.subcategoria))]
    : [];
  const productosFiltrados = subcategoriaSeleccionada
    ? productos.filter(
        (p) => p.categoria === categoriaSeleccionada && p.subcategoria === subcategoriaSeleccionada
      )
    : [];

  const agregarProducto = (producto) => {
    setPedido([...pedido, producto]);
  };

  const eliminarProducto = (index) => {
    setPedido(pedido.filter((_, i) => i !== index));
  };

  const guardarPedidoCocinaSupabase = async (pedido) => {
    if (!nombre || !telefono) {
      alert("Por favor, completá los datos del cliente.");
      return;
    }

    console.log("Intentando guardar en Supabase:", {
      pedido,
      cliente: { nombre, telefono },
      hora: new Date().toLocaleTimeString(),
      estado: "pendiente",
    });

    const { error } = await supabase.from('pedidos').insert([
      {
        pedido,
        cliente: { nombre, telefono },
        hora: new Date().toISOString(),
        estado: "pendiente",
      }
    ]);
    if (error) {
      alert("Error al guardar el pedido en Supabase");
      console.error("Supabase error:", error);
    } else {
      alert("¡Pedido guardado en Supabase!");
    }
  };

  const total = pedido.reduce((acc, prod) => acc + prod.precio, 0);

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center text-red-700">
        Sorrento Pedidos
      </h1>

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
      </div>

      {/* Categorías */}
      <div className="mb-4 flex flex-wrap gap-4 justify-center">
        {categorias.map((cat) => (
          <button
            key={cat}
            className="bg-green-500 hover:bg-green-600 text-white text-2xl font-bold px-16 py-10 rounded-xl shadow-lg transition-transform transform hover:scale-105"
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
        <div className="mb-4 flex flex-wrap gap-4 justify-center">
          {subcategorias.map((sub) => (
            <button
              key={sub}
              className="bg-green-500 hover:bg-green-600 text-white text-2xl font-bold px-16 py-10 rounded-xl shadow-lg transition-transform transform hover:scale-105"
              onClick={() => setSubcategoriaSeleccionada(sub)}
            >
              {sub}
            </button>
          ))}
        </div>
      )}

      {/* Productos con imagen */}
      {productosFiltrados.length > 0 && (
        <div className="mb-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 justify-center">
          {productosFiltrados.map((prod, i) => (
            <div
              key={i}
              className="bg-white shadow-md rounded-lg overflow-hidden flex flex-col items-center p-2 cursor-pointer hover:shadow-xl transition"
            >
              <img
                src={`/imagenes/${prod.imagen}`}
                alt={prod.nombre}
                className="max-w-[160px] max-h-[160px] object-contain rounded mb-2"
                onClick={() => setProductoSeleccionado(i)}
              />
              <p className="text-base font-semibold text-center">{prod.nombre}</p>
              <p className="text-sm text-gray-600">${prod.precio}</p>
              {productoSeleccionado === i && (
                <div className="w-full mt-2 flex flex-col items-center">
                  <input
                    type="text"
                    placeholder="Observaciones (opcional)"
                    value={observacionProducto}
                    onChange={e => setObservacionProducto(e.target.value)}
                    className="w-full px-2 py-1 border rounded mb-2"
                  />
                  <button
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded"
                    onClick={() => {
                      agregarProducto({ ...prod, observacion: observacionProducto });
                      setProductoSeleccionado(null);
                      setObservacionProducto("");
                    }}
                  >
                    Agregar al pedido
                  </button>
                  <button
                    className="text-xs text-gray-500 mt-1"
                    onClick={() => {
                      setProductoSeleccionado(null);
                      setObservacionProducto("");
                    }}
                  >
                    Cancelar
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Pedido */}
      {pedido.length > 0 && (
        <div className="mt-6 bg-gray-100 p-4 rounded shadow-md">
          <h2 className="text-xl font-semibold mb-2">Pedido Actual:</h2>
          <ul className="list-disc pl-5">
            {pedido.map((item, idx) => (
              <li key={idx} className="flex items-center justify-between">
                <span>{item.nombre} - ${item.precio}</span>
                <button
                  className="ml-4 bg-red-500 hover:bg-red-700 text-white px-3 py-1 rounded"
                  onClick={() => eliminarProducto(idx)}
                >
                  Eliminar
                </button>
              </li>
            ))}
          </ul>
          <p className="mt-2 font-bold">Total: ${total}</p>

          <button
            className="mt-4 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded text-lg font-semibold"
            onClick={async () => {
              await guardarPedidoCocinaSupabase(pedido);
              setPedido([]);
              setNombre("");
              setTelefono("");
              setObservacionProducto("");
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

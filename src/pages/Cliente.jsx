import React, { useState } from "react";
import productosData from "../productos.json";

function Cliente() {
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [subcategoriaSeleccionada, setSubcategoriaSeleccionada] = useState(null);

  // Solo productos activos
  const productos = productosData.filter((p) => p.activo !== false);

  // Categorías únicas
  const categorias = [...new Set(productos.map(p => p.categoria))];

  // Subcategorías de la categoría seleccionada
  const subcategorias = categoriaSeleccionada
    ? [...new Set(productos.filter(p => p.categoria === categoriaSeleccionada).map(p => p.subcategoria))]
    : [];

  // Productos filtrados por categoría y subcategoría
  const productosFiltrados = productos.filter(p =>
    p.categoria === categoriaSeleccionada &&
    (!p.subcategoria || p.subcategoria === subcategoriaSeleccionada)
  );

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Seleccioná una categoría</h1>

      {/* Botones de categorías */}
      <div className="flex flex-wrap gap-2 mb-4">
        {categorias.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setCategoriaSeleccionada(cat);
              setSubcategoriaSeleccionada(null);
            }}
            className={`px-4 py-2 rounded ${
              cat === categoriaSeleccionada ? "bg-red-700 text-white" : "bg-gray-200"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Botones de subcategorías si existen */}
      {subcategorias.length > 0 && (
        <>
          <h2 className="text-xl font-semibold mb-2">Subcategorías</h2>
          <div className="flex flex-wrap gap-2 mb-4">
            {subcategorias.map((sub) => (
              <button
                key={sub}
                onClick={() => setSubcategoriaSeleccionada(sub)}
                className={`px-4 py-2 rounded ${
                  sub === subcategoriaSeleccionada ? "bg-blue-600 text-white" : "bg-gray-200"
                }`}
              >
                {sub}
              </button>
            ))}
          </div>
        </>
      )}

      {/* Productos filtrados */}
      {productosFiltrados.length > 0 && (
        <>
          <h3 className="text-lg font-semibold mb-2">Productos</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {productosFiltrados.map((prod) => (
              <button
                key={prod.nombre}
                className="border p-4 rounded shadow hover:bg-green-100"
              >
                {prod.nombre}<br />${prod.precio}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default Cliente;

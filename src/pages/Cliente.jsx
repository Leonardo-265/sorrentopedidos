import React from "react";

export default function Cliente() {
  return (
    <div className="min-h-screen bg-[#fffdf7] p-6">
      <h2 className="text-3xl font-bold text-[#a51c1c] mb-6">Menú</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {/* Ejemplo de producto */}
        <div className="border rounded-2xl shadow p-4 bg-white">
          <img
            src="/ruta-a-tu-imagen.jpg"
            alt="Producto"
            className="w-full h-32 object-cover rounded-xl mb-3"
          />
          <h3 className="text-lg font-semibold text-[#333]">Producto Ejemplo</h3>
          <p className="text-[#777]">$1500</p>
          <button className="mt-3 bg-[#a51c1c] text-white px-4 py-2 rounded-xl hover:bg-[#911919] transition-all">
            Agregar
          </button>
        </div>
        {/* Repetir estructura para más productos */}
      </div>
    </div>
  );
}

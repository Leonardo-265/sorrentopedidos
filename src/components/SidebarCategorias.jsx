import React from "react";

export default function SidebarCategorias({ categorias, onSelect, seleccionada }) {
  return (
    <div className="sidebar">
      {categorias.map((cat) => (
        <button
          key={cat}
          className={cat === seleccionada ? "cat-btn selected" : "cat-btn"}
          onClick={() => onSelect(cat)}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}

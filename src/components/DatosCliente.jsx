import React from "react";

export default function DatosCliente({ datos, setDatos }) {
  const actualizar = (campo, valor) => setDatos({ ...datos, [campo]: valor });

  return (
    <div className="datos-cliente">
      <h3>Datos del Cliente</h3>
      <input
        placeholder="Nombre"
        value={datos.nombre}
        onChange={(e) => actualizar("nombre", e.target.value)}
      />
      <input
        placeholder="Teléfono"
        value={datos.telefono}
        onChange={(e) => actualizar("telefono", e.target.value)}
      />
      <input
        placeholder="Dirección"
        value={datos.direccion}
        onChange={(e) => actualizar("direccion", e.target.value)}
      />
      <input
        placeholder="Forma de pago"
        value={datos.pago}
        onChange={(e) => actualizar("pago", e.target.value)}
      />
      <input
        placeholder="Horario de entrega"
        value={datos.horario}
        onChange={(e) => actualizar("horario", e.target.value)}
      />
      <input
        placeholder="Observaciones"
        value={datos.observaciones}
        onChange={(e) => actualizar("observaciones", e.target.value)}
      />
    </div>
  );
}

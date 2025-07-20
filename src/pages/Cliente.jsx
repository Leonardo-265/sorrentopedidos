import { useState, useEffect } from 'react'
import productos from '../productos.json'
import { supabase } from '../supabaseClient'

export default function Cliente() {
  const [pedido, setPedido] = useState([])
  const [cliente, setCliente] = useState({ nombre: '', telefono: '', direccion: '' })

  const agregarProducto = (producto) => {
    setPedido([...pedido, producto])
  }

  const total = pedido.reduce((acc, item) => acc + item.precio, 0)

  const confirmarPedido = async () => {
    const detalle = pedido.map(p => p.nombre).join(', ')
    await supabase.from('pedidos').insert([
      {
        nombre: cliente.nombre,
        telefono: cliente.telefono,
        direccion: cliente.direccion,
        detalle,
        total,
        estado: 'pendiente'
      }
    ])
    alert('Pedido enviado con éxito')
    setPedido([])
  }

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Menú</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {productos.map(p => (
          <div key={p.id} className="border rounded-xl p-2 bg-white shadow">
            <img src={p.imagen} alt={p.nombre} className="w-full h-32 object-cover rounded" />
            <h3 className="mt-2 font-semibold">{p.nombre}</h3>
            <p>${p.precio}</p>
            <button
              onClick={() => agregarProducto(p)}
              className="mt-2 bg-green-600 text-white w-full py-1 rounded"
            >Agregar</button>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-bold mt-6">Tus datos</h2>
      <input
        type="text"
        placeholder="Nombre"
        value={cliente.nombre}
        onChange={(e) => setCliente({ ...cliente, nombre: e.target.value })}
        className="w-full p-2 border rounded my-1"
      />
      <input
        type="text"
        placeholder="Teléfono"
        value={cliente.telefono}
        onChange={(e) => setCliente({ ...cliente, telefono: e.target.value })}
        className="w-full p-2 border rounded my-1"
      />
      <input
        type="text"
        placeholder="Dirección"
        value={cliente.direccion}
        onChange={(e) => setCliente({ ...cliente, direccion: e.target.value })}
        className="w-full p-2 border rounded my-1"
      />

      <div className="mt-4 text-lg">Total: ${total}</div>
      <button
        onClick={confirmarPedido}
        className="mt-2 bg-blue-600 text-white px-6 py-2 rounded"
      >
        Confirmar pedido
      </button>
    </div>
  )
}
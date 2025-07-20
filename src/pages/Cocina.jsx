import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'

export default function Cocina() {
  const [pedidos, setPedidos] = useState([])

  useEffect(() => {
    const cargar = async () => {
      const { data } = await supabase.from('pedidos').select('*').order('created_at', { ascending: false })
      setPedidos(data)
    }
    cargar()
    const interval = setInterval(cargar, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Pedidos en Cocina</h1>
      {pedidos.map((p, i) => (
        <div key={i} className="border rounded p-2 mb-2 bg-white shadow">
          <div><strong>Cliente:</strong> {p.nombre}</div>
          <div><strong>Tel:</strong> {p.telefono}</div>
          <div><strong>Dirección:</strong> {p.direccion}</div>
          <div><strong>Detalle:</strong> {p.detalle}</div>
          <div><strong>Total:</strong> ${p.total}</div>
          <div><strong>Estado:</strong> {p.estado}</div>
        </div>
      ))}
    </div>
  )
}

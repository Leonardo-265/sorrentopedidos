import { useNavigate } from 'react-router-dom'

export default function Inicio() {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-yellow-100">
      <img src="/img/logo.png" alt="Sorrento Pastas" className="w-40 mb-6" />
      <h1 className="text-3xl font-bold mb-4">Bienvenido a Sorrento Pastas</h1>
      <button
        onClick={() => navigate('/menu')}
        className="px-6 py-3 bg-red-600 text-white rounded-xl text-lg"
      >
        Hacer un pedido
      </button>
    </div>
  )
}

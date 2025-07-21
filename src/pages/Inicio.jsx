import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png"; // asegurate de tener tu logo aquí

export default function Inicio() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[#fffdf7] text-center px-4">
      <img src={logo} alt="Sorrento Pastas" className="w-40 mb-6" />
      <h1 className="text-3xl font-bold text-[#a51c1c]">Bienvenido a Sorrento Pastas</h1>
      <p className="text-gray-700 mt-2">Tu pedido casero, rápido y delicioso</p>
      <button
        onClick={() => navigate("/menu")}
        className="mt-6 px-6 py-3 bg-[#a51c1c] text-white rounded-lg shadow hover:bg-[#861010] transition-all"
      >
        Hacer un pedido
      </button>
    </div>
  );
}

import { useState } from "react";
import api from "@/services/api/api";
import { useNavigate } from "react-router-dom";

export function CodeMail() {
  const navigate = useNavigate();

  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      // Envia o código para validação no backend
      const res = await api.post("/auth/verify-code", { code });

      if (res.data.success) {
        setMessage(res.data.message || "Código válido!");
        // Redireciona para a página de redefinição de senha
        console.log(res.data)
        localStorage.setItem("id", res.data.userId)
        navigate(`/reset-password/${code}`);
        
      } else {
        setMessage(res.data.message || "Código inválido ou expirado.");
      }
    } catch (err: any) {
      setMessage(
        err.response?.data?.message || "Erro ao verificar o código."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
        >
          <h2 className="text-xl font-bold mb-4 text-center">
            Digite o Código
          </h2>

          <input
            type="text"
            placeholder="Código de 6 dígitos"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
            className="w-full p-2 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-center text-lg"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition disabled:opacity-50"
          >
            {loading ? "Verificando..." : "Verificar Código"}
          </button>

          {message && (
            <p className="mt-4 text-center text-sm text-gray-700">{message}</p>
          )}
        </form>
      </div>
    </div>
  );
}

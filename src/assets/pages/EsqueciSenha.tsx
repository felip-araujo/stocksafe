import { useState } from "react";
import api from "@/services/api/api";
import { useNavigate } from "react-router-dom";

export function EsqSenha() {

  const navigate = useNavigate()

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await api.post("/auth/recover-password", { email });
      if (res) {
        setMessage(res.data.message || "Verifique sua caixa de e-mail!");
        navigate
      }
    } catch (err: any) {
      setMessage(
        err.response?.data?.message || "Erro ao solicitar recuperação de senha."
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
            Recuperar Senha
          </h2>
          <input
            type="email"
            placeholder="Digite seu e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-2 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition disabled:opacity-50"
          >
            {loading ? "Enviando..." : "Recuperar Senha"}
          </button>
          {message && (
            <p className="mt-4 text-center text-sm text-gray-700">{message}</p>
          )}
        </form>
      </div>
    </div>
  );
}

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/services/api/api";

export function EsqSenha() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      console.log("📨 Enviando e-mail de recuperação para:", email);

      const res = await api.post("/auth/recover-password", { email });

      if (res.status === 200) {
        setMessage(res.data.message || "Verifique sua caixa de entrada!");
        // Aguarda 1s e vai para a tela de código
        console.log(res.data)
        setTimeout(() => navigate("/code-insert"), 1000);
      } else {
        setError("Não foi possível enviar o e-mail. Tente novamente.");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error("Erro ao enviar e-mail:", err.message);
      }

      const apiError = err as { response?: { data?: { message?: string } } };
      setError(apiError.response?.data?.message || "Erro ao enviar e-mail.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
      >
        <h2 className="text-xl font-bold mb-4 text-center">Recuperar Senha</h2>

        <input
          type="email"
          placeholder="Digite seu e-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-2 mb-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? "Enviando..." : "Enviar código"}
        </button>

        {message && (
          <p className="mt-4 text-green-600 text-center text-sm">{message}</p>
        )}
        {error && <p className="mt-4 text-red-500 text-center text-sm">{error}</p>}
      </form>
    </div>
  );
}

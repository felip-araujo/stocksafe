import api from "@/services/api/api";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export function CancelarAssinatura() {
  const navigate = useNavigate();
  const userId = localStorage.getItem("id");
  const companyId = localStorage.getItem("companyId");
  const [showForm, setShowForm] = useState(false);
  const [motivo, setMotivo] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCancelClick = () => {
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!motivo.trim()) {
      toast("Por favor, descreva o motivo do cancelamento.");
      return;
    }

    if (!userId || !companyId) {
      toast("Erro: informações do usuário não encontradas.");
      return;
    }

    try {
      setLoading(true);

      // 1️⃣ Salva o motivo do cancelamento
      await api.post("/cancelar", {
        userId,
        motivo,
      });

      // 2️⃣ Cancela a assinatura no Stripe e recebe mensagem do servidor
      const response = await api.post(`/subscription/${companyId}/cancel`);

      // 3️⃣ Exibe a mensagem personalizada vinda do backend
      if (response?.data?.message) {
        toast.success(response.data.message);
      } else {
        toast.success("Assinatura cancelada com sucesso.");
      }

      navigate("/assinatura/necessaria");
    } catch (error) {
      console.error("Erro ao cancelar assinatura:", error);
      toast.error("Ocorreu um erro ao cancelar a assinatura. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={handleCancelClick}
        className="text-zinc-900 font-normal border-b-2 border-transparent hover:border-destructive transition-all duration-200"
      >
        Cancelar Assinatura
      </button>

      {showForm && (
        <div className="fixed inset-0 bg-black/60 bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-lg p-6 w-[90%] max-w-md">
            <h2 className="text-lg font-semibold text-zinc-800 mb-2">
              Cancelar assinatura
            </h2>
            <p className="text-sm text-zinc-600 mb-4">
              Antes de prosseguir, conte-nos brevemente o motivo do cancelamento.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <textarea
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                placeholder="Digite o motivo aqui..."
                className="w-full h-24 border border-zinc-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-destructive"
              ></textarea>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  disabled={loading}
                  className="px-4 py-2 text-sm text-zinc-600 hover:text-zinc-800"
                >
                  Voltar
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className={`px-4 py-2 text-sm rounded-md text-white ${
                    loading
                      ? "bg-zinc-400 cursor-not-allowed"
                      : "bg-destructive hover:bg-red-600"
                  }`}
                >
                  {loading ? "Cancelando..." : "Confirmar Cancelamento"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

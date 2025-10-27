import api from "@/services/api/api";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function CancelarAssinatura() {
  const navigate = useNavigate();
  const userId = localStorage.getItem("id");
  const [showForm, setShowForm] = useState(false);
  const [motivo, setMotivo] = useState("");

  const handleCancelClick = () => {
    setShowForm(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (motivo.trim() === "") {
      alert("Por favor, descreva o motivo do cancelamento.");
      return;
    }

    console.log("Motivo do cancelamento:", motivo);

    api.post("/cancelar", {
      userId,
      motivo,
    });
    // Aqui você pode enviar o motivo para o servidor se desejar:
    // await fetch("/api/cancelar", { method: "POST", body: JSON.stringify({ motivo }) });

    navigate("/assinatura/necessaria");
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
              Antes de prosseguir, conte-nos brevemente o motivo do
              cancelamento.
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
                  className="px-4 py-2 text-sm text-zinc-600 hover:text-zinc-800"
                >
                  Voltar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-destructive text-white text-sm rounded-md hover:bg-red-600"
                >
                  Confirmar Cancelamento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

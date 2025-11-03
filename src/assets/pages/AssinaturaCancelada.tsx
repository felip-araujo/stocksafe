import { useNavigate } from "react-router-dom";
import { ArrowLeftCircle, RefreshCcw } from "lucide-react";

export function Cancelada() {

  const linkcheckout = localStorage.getItem("checkout")
  const navigate = useNavigate();

  
  const handleVoltarCheckout = () => {
    if (linkcheckout) {
      window.location.href = linkcheckout;
    } else {
      navigate("/assinatura");
    }
  };

  return (
    <section className="min-h-screen flex flex-col justify-center items-center bg-gray-50 px-6 text-center">
      <div className="max-w-md bg-white shadow-lg rounded-2xl p-8">
        <div className="flex justify-center mb-6">
          <ArrowLeftCircle className="w-12 h-12 text-amber-500" />
        </div>

        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Tudo bem, talvez ainda não seja o momento 👋
        </h1>

        <p className="text-gray-600 mb-6">
          Mas não perca o foco: com o <span className="font-semibold text-amber-500">Stock Seguro</span>,
          você pode transformar o caos do estoque em lucro real e previsível.
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={handleVoltarCheckout}
            className="bg-amber-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-amber-600 transition"
          >
            Voltar e concluir a assinatura
          </button>

          <button
            onClick={() => navigate("/")}
            className="flex items-center justify-center gap-2 text-gray-600 hover:text-amber-500 transition"
          >
            <RefreshCcw className="w-4 h-4" />
            <span>Explorar o sistema novamente</span>
          </button>
        </div>

        <div className="mt-8 border-t pt-4 text-sm text-gray-500">
          💡 Dica: você pode começar o teste grátis agora e só pagar depois.
        </div>
      </div>
    </section>
  );
}

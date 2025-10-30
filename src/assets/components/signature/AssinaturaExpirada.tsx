import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Element } from "react-scroll";

interface Plan {
  id: string;
  name: string;
  price: string;
  description: string;
  priceId?: string;
  features: string[];
}

export function AssinaturaExpirada() {
  const [loading, setLoading] = useState<string | null>(null);
  const navigate = useNavigate();

  const plans: Plan[] = [
    {
      id: "basic",
      name: "Plano Básico",
      price: "R$ 79,90/mês",
      description:
        "Ideal para retomar o controle do almoxarifado, registrar requisições e automatizar o dia a dia.",
      priceId: "price_1SAy2LKKzmjTKU738zEEFmhd",
      features: [
        "Até 10 usuários",
        "Até 2 administradores",
        "Suporte via e-mail em até 48h",
        "Acesso ao painel de Materiais",
        "Acesso ao painel de Requisições",
      ],
    },
    {
      id: "gold",
      name: "Plano Ouro",
      price: "R$ 119,90/mês",
      description:
        "Retome o controle completo de vendas, estoque e relatórios em tempo real, sem limites de usuários.",
      priceId: "price_1SJG1MKKzmjTKU73xxqtViUk",
      features: [
        "Usuários ilimitados",
        "Atendimento técnico via chat",
        "Acesso ao painel de Materiais",
        "Acesso ao painel de Requisições",
        "Acesso ao painel de Vendas",
        "Acesso ao painel de Produtos",
      ],
    },
  ];

  const handleSubscribe = async (priceId: string, plano: string) => {
    try {
      setLoading(priceId);
      const companyId = localStorage.getItem("companyId");

      if (!companyId) {
        navigate(`/cadastro?priceId=${priceId}&plano=${plano}`);
        return;
      }

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/subscription/${companyId}/subscribe`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ priceId, plano, trial: false }),
        }
      );

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Erro ao iniciar assinatura.");
      }
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao criar sessão de pagamento.");
    } finally {
      setLoading(null);
    }
  };

  return (
    <Element name="plans">
      <section className="w-full py-12 px-6 sm:px-12 flex flex-col items-center bg-blue-900">
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-2 text-center leading-tight">
          Sentimos sua falta!
        </h1>

        <p className="text-lg sm:text-xl text-blue-100 text-center mb-12 max-w-3xl leading-snug">
          Seu período de teste ou assinatura anterior expirou. Mas você pode{" "}
          <span className="font-semibold text-white">reativar seu plano</span>{" "}
          agora mesmo e continuar gerenciando seu estoque e requisições sem interrupções.
        </p>

        <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 max-w-6xl w-full">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className="bg-white rounded-2xl shadow-md p-6 sm:p-8 flex flex-col justify-between hover:shadow-xl transition-all duration-300"
            >
              <div>
                <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-2">
                  {plan.name}
                </h2>
                <p className="text-gray-600 mb-4 text-sm sm:text-base">
                  {plan.description}
                </p>

                <p className="text-3xl sm:text-4xl font-bold mb-6 text-blue-600">
                  {plan.price}
                </p>

                <ul className="text-gray-700 space-y-2 mb-6 text-sm sm:text-base">
                  {plan.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-blue-500 mt-1">•</span>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => handleSubscribe(plan.priceId!, plan.id)}
                disabled={loading === plan.priceId}
                className={`w-full py-3 sm:py-4 rounded-lg font-semibold text-white text-base sm:text-lg transition-all ${
                  loading === plan.priceId
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {loading === plan.priceId ? "Processando..." : "Reativar Plano"}
              </button>
            </div>
          ))}
        </div>
      </section>
    </Element>
  );
}

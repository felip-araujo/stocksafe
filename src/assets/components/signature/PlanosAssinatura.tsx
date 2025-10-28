import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Element } from "react-scroll";

interface Plan {
  id: string;
  name: string;
  price: string;
  description: string;
  priceId: string;
  features: string[];
}

export function SubscriptionPlans() {
  const [loading, setLoading] = useState<string | null>(null);
  const navigate = useNavigate();

  const plans: Plan[] = [
    {
      id: "basic",
      name: "Plano Básico",
      price: "R$ 79,90/mês",
      description: "Ideal para gerenciar o almoxarifado, registrar requisições e automatizar o dia a dia.",
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
      description: "Usuários ilimitados, com controle de vendas, estoque e valores em tempo real.",
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
          body: JSON.stringify({ priceId, plano }),
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
      <section className="w-full bg-gray-50 py-8 px-5 sm:px-8 flex mt-6 flex-col items-center">
        <h1 className="text-3xl sm:text-4xl font-bold mb-3 text-center text-gray-900 leading-none">
          Escolha o plano ideal para o seu negócio
        </h1>

        <p className="text-base sm:text-lg text-gray-600 text-center mb-10 max-w-2xl leading-relaxed">
          Simplifique sua rotina e tenha{" "}
          <span className="font-semibold text-gray-800">
            controle total do seu estoque
          </span>{" "}
          — o <strong>Stock Seguro</strong> te mostra o que entra, o que sai e o que realmente dá lucro.
        </p>

        <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 max-w-5xl w-full">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className="bg-white rounded-2xl shadow-md p-6 sm:p-8 flex flex-col justify-between hover:shadow-lg transition-all duration-300"
            >
              <div>
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">
                  {plan.name}
                </h2>
                <p className="text-gray-600 mb-4 text-sm sm:text-base">
                  {plan.description}
                </p>

                <p className="text-3xl sm:text-4xl font-bold text-blue-600 mb-6">
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
                onClick={() => handleSubscribe(plan.priceId, plan.id)}
                disabled={loading === plan.priceId}
                className={`w-full py-3 sm:py-4 rounded-lg font-semibold text-white text-base sm:text-lg ${
                  loading === plan.priceId
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 transition-all"
                }`}
              >
                {loading === plan.priceId ? "Processando..." : "Assinar Agora"}
              </button>
            </div>
          ))}
        </div>
      </section>
    </Element>
  );
}

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Element } from "react-scroll";

interface Plan {
  id: string;
  name: string;
  price: string;
  description: string;
  priceId: string; // ID do preço vindo do Stripe
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
      description: "Ideal para pequenas equipes que estão começando.",
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
      description: "Para empresas que precisam de mais controle e recursos.",
      priceId: "price_1SJG1MKKzmjTKU73xxqtViUk",
      features: [
        "Usuários ilimitados",
        "Atendimento técnico via chat",
        "Acesso ao painel de Materiais",
        "Acesso ao painel de Requisições",
        "Acesso ao painel de vendas",
        "Acesso ao painel de produtos",
      ],
    },
  ];

  const handleSubscribe = async (priceId: string, plano: string) => {
    try {
      setLoading(priceId);

      const companyId = localStorage.getItem("companyId");

      // Se não tiver empresa, redireciona para o cadastro
      if (!companyId) {
        navigate(`/cadastro?priceId=${priceId}&plano=${plano}`);
        return;
      }

      // Cria sessão de pagamento com o plano e priceId
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
        // Redireciona para o checkout do Stripe
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
      <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10 px-4">
        <h1 className="text-2xl font-light mb-8 text-center text-gray-800">
          Escolha seu plano de assinatura
        </h1>

        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 max-w-4xl w-full">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className="bg-white rounded-2xl shadow-md p-6 flex flex-col justify-between hover:shadow-lg transition-all"
            >
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  {plan.name}
                </h2>
                <p className="text-gray-600 mb-4">{plan.description}</p>
                <p className="text-3xl font-bold text-blue-600 mb-4">
                  {plan.price}
                </p>
                <ul className="text-gray-700 space-y-2 mb-6">
                  {plan.features.map((feat, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      - <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => handleSubscribe(plan.priceId, plan.id)}
                disabled={loading === plan.priceId}
                className={`w-full py-3 rounded-lg font-semibold text-white ${
                  loading === plan.priceId
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 transition-all"
                }`}
              >
                {loading === plan.priceId ? "Processando..." : "Assinar"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </Element>
  );
}

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Element } from 'react-scroll';

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
      priceId: "price_1SJFqXKKzmjTKU73NBCPJ7ik", // substitua pelo ID real do Stripe
      features: [
        "Até 10 usuários",
        "Até 2 administradores",
        "Suporte via e-mail em até 24h",
        "Acesso ao painel",
      ],
    },
    {
      id: "premium",
      name: "Plano Ouro",
      price: "R$ 119,90/mês",
      description: "Para empresas que precisam de mais controle e recursos.",
      priceId: "price_1SJFs7KKzmjTKU73pRb6zGuT",
      features: [
        "Usuários ilimitados",
        "Atendimento técnico via chat",
        "Recursos avançados de gestão",
        "Relatórios personalizados"
      ],
    },
  ];

  const handleSubscribe = async (priceId: string) => {
    try {
      setLoading(priceId);

      const companyId = localStorage.getItem("companyId");
      console.log(priceId)

      // se não tiver empresa no localStorage, manda para a tela de cadastro
      if (!companyId) {
        navigate(`/cadastro?priceId=${priceId}`);
        return;
      }

      // caso tenha empresa logada, cria a sessão de pagamento
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/subscription/${companyId}/subscribe`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ priceId }),
        }
      );

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url; // redireciona para o checkout Stripe
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
      <h1 className="text-2xl font-ligth mb-8 text-center text-gray-800">
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
              onClick={() => handleSubscribe(plan.priceId)}
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

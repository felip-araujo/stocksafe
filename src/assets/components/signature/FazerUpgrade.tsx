import { useNavigate } from "react-router-dom";

interface Plan {
  id: string;
  name: string;
  price: string;
  description: string;
  priceId: string; // ID do preço vindo do Stripe
  features: string[];
}

export function UpgradePlan() {
  const navigate = useNavigate();

  const plan: Plan[] = [
    {
      id: "gold",
      name: "gold",
      price: "R$ 119,90/mês",
      description: "Para empresas que precisam de mais controle e recursos.",
      priceId: "price_1SJG1MKKzmjTKU73xxqtViUk",
      features: [
        "Usuários ilimitados",
        "Atendimento técnico via chat",
        "Recursos avançados de gestão",
        "Relatórios personalizados",
      ],
    },
  ];

  const handleUpgrade = async (priceId: string, plano: string) => {
    try {
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
    }
  };

  return (
    <>
      {plan.map((p) => (
        
        <button
          key={p.id}
          onClick={() => handleUpgrade(p.priceId, p.name)}
          className="p-2 rounded mt-2 bg-yellow-500 text-white hover:bg-yellow-600 font-medium"
        >
          Assinar {p.name}
        </button>
      ))}
    </>
  );
}

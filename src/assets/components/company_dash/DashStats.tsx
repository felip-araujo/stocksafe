import { useEffect, useState } from "react";
import { SidebarDash } from "./SideBarDash";
import api from "@/services/api/api";
import { ArrowUp, ArrowDown, Minus, LockIcon } from "lucide-react";

export interface DashboardStats {
  totalUsers: number;
  totalProducts: number;
  totalRequests: number;
  totalMaterial: number;
  pendingRequests: number;
  totalPrice: number;
  totalValue: number;
}

export function DashboardCompany() {
  const companyId = localStorage.getItem("companyId");
  const plan = localStorage.getItem("plano");
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [totalPrice, setTotalPrice] = useState<number | null>(null);
  const [totalValue, setTotalValue] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  // 🔹 Busca dados
  const fetchStats = async () => {
    if (!companyId) return;
    try {
      setLoading(true);
      const res = await api.get(`/dashstats/${companyId}`);
      setStats(res.data);
    } catch (err) {
      console.error("Erro ao buscar estatísticas:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPrice = async () => {
    if (!companyId) return;
    try {
      const res = await api.get(`/product/total/price/${companyId}`);
      setTotalPrice(res.data.totalPrice);
    } catch (err) {
      console.error("Erro ao buscar valor total dos produtos:", err);
    }
  };

  const handleSalesTotal = async () => {
    if (!companyId) return;
    try {
      const res = await api.get(`/sale/total/value/${companyId}`);
      setTotalValue(res.data.totalValue);
    } catch (err) {
      console.error("Erro ao buscar total de vendas:", err);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchPrice();
    handleSalesTotal();
  }, [companyId]);

  // 🔹 Determina status das vendas
  const getSalesStatus = () => {
    if (totalValue === null || totalPrice === null) {
      return {
        bg: "bg-yellow-300",
        textColor: "text-black",
        icon: <Minus className="w-5 h-5" />,
        label: "Carregando...",
      };
    }
    if (totalValue > totalPrice) {
      return {
        bg: "bg-green-600",
        textColor: "text-white",
        icon: <ArrowUp className="w-5 h-5 text-white" />,
        label: "Lucro",
      };
    }
    if (totalValue < totalPrice) {
      return {
        bg: "bg-red-500",
        textColor: "text-white",
        icon: <ArrowDown className="w-5 h-5 text-white" />,
        label: "Abaixo do esperado",
      };
    }
    return {
      bg: "bg-yellow-300",
      textColor: "text-black",
      icon: <Minus className="w-5 h-5" />,
      label: "Equilibrado",
    };
  };

  const salesStatus = getSalesStatus();

  // 🔹 Define a cor do card de requisições pendentes
  const getPendingStatus = () => {
    if ((stats?.pendingRequests ?? 0) >= 1) {
      return {
        bg: "bg-yellow-500",
        textColor: "text-black",
      };
    }
    return {
      bg: "bg-white",
      textColor: "text-gray-800",
    };
  };

  const pendingStatus = getPendingStatus();

  // 🔹 Cards premium (apenas para Gold)
  const premiumCards = ["Produtos", "Valor total em estoque", "Valor total em Vendas"];

  return (
    <div className="mt-15 md:mt-0 flex flex-col md:flex-row min-h-screen bg-gray-50">
      <SidebarDash />
      <main className="flex-1 p-4 md:p-6">


        {loading ? (
          <p>Carregando...</p>
        ) : stats ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                label: "Valor total em Vendas",
                value:
                  totalValue !== null
                    ? totalValue.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
                    : "—",
                bg: salesStatus.bg,
                textColor: salesStatus.textColor,
                icon: salesStatus.icon,
                labelStatus: salesStatus.label,
              },
              {
                label: "Valor total em estoque",
                value:
                  totalPrice !== null
                    ? totalPrice.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
                    : "—",
                highlight: "text-blue-900",
              },
              {
                label: "Requisições Pendentes",
                value: stats.pendingRequests ?? 0,
                bg: pendingStatus.bg,
                textColor: pendingStatus.textColor,
              },
              { label: "Produtos", value: stats.totalProducts },
              { label: "Colaboradores", value: stats.totalUsers },
              { label: "Materiais", value: stats.totalMaterial },
            ].map((card, index) => {
              const isPremium = premiumCards.includes(card.label);
              const isLocked = plan === "basic" && isPremium;

              return (
                <div
                  key={index}
                  className={`relative p-4 sm:p-6 rounded-lg shadow flex flex-col items-center justify-center
                    ${card.bg || "bg-white"}
                    ${isLocked ? "opacity-60 backdrop-blur-sm cursor-not-allowed" : ""}
                    transition-all duration-300`}
                  title={isLocked ? "Recurso exclusivo do plano Gold" : ""}
                >
                  <h2 className={`text-lg font-semibold mb-2 ${card.textColor || ""}`}>
                    {card.label}
                  </h2>
                  <div className="flex items-center space-x-2">
                    <p className={`text-3xl font-bold ${card.textColor || card.highlight || ""}`}>
                      {card.value}
                    </p>
                    {card.icon && !isLocked && card.icon}
                  </div>
                  {card.labelStatus && !isLocked && (
                    <p className={`mt-1 text-sm font-medium ${card.textColor}`}>
                      {card.labelStatus}
                    </p>
                  )}
                  {isLocked && (
                    <span className="absolute top-1 right-2 text-gray-200">
                      <LockIcon />
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <p>Nenhum dado disponível.</p>
        )}
      </main>
    </div>
  );
}

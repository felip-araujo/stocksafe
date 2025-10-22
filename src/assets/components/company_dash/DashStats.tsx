import { useEffect, useState } from "react";
import { SidebarDash } from "./SideBarDash";
import api from "@/services/api/api";
import { ArrowUp, ArrowDown, Minus } from "lucide-react"; // lucide-react

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
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [totalPrice, setTotalPrice] = useState<number | null>(null);
  const [totalValue, setTotalValue] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  // 🔹 Busca o valor total de produtos no estoque
  const fetchPrice = async () => {
    try {
      const res = await api.get(`/product/total/price/${companyId}`);
      setTotalPrice(res.data.totalPrice);
    } catch (err) {
      console.error("Erro ao buscar valor total dos produtos:", err);
    }
  };

  // 🔹 Busca estatísticas gerais do dashboard
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

  // 🔹 Busca o valor total de vendas
  const handleSalesTotal = async () => {
    if (!companyId) return;
    try {
      const res = await api.get(`/sale/total/value/${companyId}`);
      setTotalValue(res.data.totalValue);
    } catch (err) {
      console.error("Erro ao buscar total de vendas:", err);
    }
  };

  // 🔹 Executa todas as requisições ao carregar o componente
  useEffect(() => {
    fetchStats();
    fetchPrice();
    handleSalesTotal();
  }, [companyId]);

  // 🔹 Determina cor de fundo, cor do texto, ícone e label do cartão de vendas
  const getSalesStatus = () => {
    if (totalValue === null || totalPrice === null) {
      return { bg: "bg-yellow-300", textColor: "text-black", icon: <Minus className="w-5 h-5" />, label: "Carregando..." };
    }
    if (totalValue > totalPrice) {
      return { bg: "bg-green-600", textColor: "text-white", icon: <ArrowUp className="w-5 h-5 text-white" />, label: "Lucro" };
    }
    if (totalValue < totalPrice) {
      return { bg: "bg-red-500", textColor: "text-white", icon: <ArrowDown className="w-5 h-5 text-white" />, label: "Abaixo do esperado" };
    }
    return { bg: "bg-yellow-300", textColor: "text-black", icon: <Minus className="w-5 h-5" />, label: "Equilibrado" };
  };

  const salesStatus = getSalesStatus();

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      <SidebarDash />
      <main className="flex-1 p-4 md:p-6">
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

        {loading ? (
          <p>Carregando...</p>
        ) : stats ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Colaboradores */}
            <div className="p-4 sm:p-6 bg-white rounded-lg shadow flex flex-col items-center justify-center">
              <h2 className="text-lg font-semibold mb-2">Colaboradores</h2>
              <p className="text-3xl font-bold">{stats.totalUsers}</p>
            </div>

            {/* Produtos */}
            <div className="p-4 sm:p-6 bg-white rounded-lg shadow flex flex-col items-center justify-center">
              <h2 className="text-lg font-semibold mb-2">Produtos</h2>
              <p className="text-3xl font-bold">{stats.totalProducts}</p>
            </div>

            {/* Materiais */}
            <div className="p-4 sm:p-6 bg-white rounded-lg shadow flex flex-col items-center justify-center">
              <h2 className="text-lg font-semibold mb-2">Materiais</h2>
              <p className="text-3xl font-bold">{stats.totalMaterial}</p>
            </div>

            {/* Requisições */}
            <div className="p-4 sm:p-6 bg-white rounded-lg shadow flex flex-col items-center justify-center">
              <h2 className="text-lg font-semibold mb-2">Total de Requisições</h2>
              <p className="text-3xl font-bold">{stats.totalRequests}</p>
            </div>

            {/* Valor em estoque */}
            <div className="p-4 sm:p-6 bg-white rounded-lg shadow flex flex-col items-center justify-center">
              <h2 className="text-lg font-semibold mb-2">Valor total em estoque</h2>
              <p className="text-3xl font-bold text-blue-900">
                {totalPrice !== null
                  ? totalPrice.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
                  : "—"}
              </p>
            </div>

            {/* Requisições Pendentes */}
            <div
              className={`p-4 sm:p-6 rounded-lg shadow flex flex-col items-center justify-center ${
                stats.pendingRequests === 0 ? "bg-green-400" : "bg-yellow-300"
              }`}
            >
              <h2 className="text-lg font-semibold mb-2">Requisições Pendentes</h2>
              <p className="text-3xl font-bold">
                {stats.pendingRequests === 0 ? "Nenhuma" : stats.pendingRequests}
              </p>
            </div>

            {/* Valor total em vendas */}
            <div
              className={`p-4 sm:p-6 rounded-lg shadow flex flex-col items-center justify-center ${salesStatus.bg}`}
            >
              <h2 className={`text-lg font-semibold mb-2 ${salesStatus.textColor}`}>Valor total em Vendas</h2>
              <div className="flex items-center space-x-2">
                <p className={`text-3xl font-bold ${salesStatus.textColor}`}>
                  {totalValue !== null
                    ? totalValue.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
                    : "—"}
                </p>
                {salesStatus.icon}
              </div>
              <p className={`mt-1 text-sm font-medium ${salesStatus.textColor}`}>{salesStatus.label}</p>
            </div>
          </div>
        ) : (
          <p>Nenhum dado disponível.</p>
        )}
      </main>
    </div>
  );
}

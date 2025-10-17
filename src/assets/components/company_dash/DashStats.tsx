import { useEffect, useState } from "react";

import { SidebarDash } from "./SideBarDash";
import api from "@/services/api/api";


export interface DashboardStats {
  totalUsers: number;
  totalProducts: number;
  totalRequests: number;
  totalMaterial: number;
  pendingRequests: number;
}

export function DashboardCompany() {
  

  const companyId = localStorage.getItem("companyId");
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    fetchStats();
  }, [companyId]);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      <SidebarDash />
      <main className="flex-1 p-4 md:p-6">
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

        {loading ? (
          <p>Carregando...</p>
        ) : stats ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Total de Usuários */}
            <div className="p-4 sm:p-6 bg-white rounded-lg shadow flex flex-col items-center justify-center">
              <h2 className="text-lg font-semibold mb-2">Colaboradores</h2>
              <p className="text-3xl font-bold">{stats.totalUsers}</p>
            </div>

            {/* Total de Produtos */}
            <div className="p-4 sm:p-6 bg-white rounded-lg shadow flex flex-col items-center justify-center">
              <h2 className="text-lg font-semibold mb-2">Produtos</h2>
              <p className="text-3xl font-bold">{stats.totalProducts}</p>
            </div>

            {/* Total de Materiais */}
            <div className="p-4 sm:p-6 bg-white rounded-lg shadow flex flex-col items-center justify-center">
              <h2 className="text-lg font-semibold mb-2">Materiais</h2>
              <p className="text-3xl font-bold">{stats.totalMaterial}</p>
            </div>

            {/* Total de Requisições */}
            <div className="p-4 sm:p-6 bg-white rounded-lg shadow flex flex-col items-center justify-center">
              <h2 className="text-lg font-semibold mb-2">Total de Requisições</h2>
              <p className="text-3xl font-bold">{stats.totalRequests}</p>
            </div>

            {/* Total de Requisições Pendentes */}
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
          </div>
        ) : (
          <p>Nenhum dado disponível.</p>
        )}
      </main>
    </div>
  );
}

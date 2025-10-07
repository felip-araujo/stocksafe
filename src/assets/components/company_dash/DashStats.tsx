import { useEffect, useState } from "react";
import { useAuthGuard } from "@/services/hooks/validator";
import { SidebarDash } from "./SideBarDash";
import api from "@/services/api/api";

export interface DashboardStats {
  totalUsers: number;
  totalProducts: number;
  totalRequests: number;
  totalMaterial: number
}


export function DashboardCompany() {
  useAuthGuard(["COMPANY_ADMIN"]);

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

  console.log(stats)

  useEffect(() => {
    fetchStats();
  }, [companyId]);

  return (
    <div className="flex min-h-screen">
      <SidebarDash />

      <div className="flex-1 p-6 bg-gray-50">
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

        {loading ? (
          <p>Carregando...</p>
        ) : stats ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Total de Usuários */}
            <div className="p-6 bg-white rounded-lg shadow flex flex-col items-center justify-center">
              <h2 className="text-lg font-semibold mb-2">Usuários</h2>
              <p className="text-3xl font-bold">{stats.totalUsers}</p>
            </div>

            {/* Total de Produtos */}
            <div className="p-6 bg-white rounded-lg shadow flex flex-col items-center justify-center">
              <h2 className="text-lg font-semibold mb-2">Produtos</h2>
              <p className="text-3xl font-bold">{stats.totalProducts}</p>
            </div>

            {/* Total de Materiais */}
            <div className="p-6 bg-white rounded-lg shadow flex flex-col items-center justify-center">
              <h2 className="text-lg font-semibold mb-2">Material</h2>
              <p className="text-3xl font-bold">{stats.totalMaterial}</p>
            </div>
           
            {/* Total de Materiais */}
            <div className="p-6 bg-white rounded-lg shadow flex flex-col items-center justify-center">
              <h2 className="text-lg font-semibold mb-2">Requisições</h2>
              <p className="text-3xl font-bold">{stats.totalRequests}</p>
            </div>
          </div>
        ) : (
          <p>Nenhum dado disponível.</p>
        )}
      </div>
    </div>
  );
}

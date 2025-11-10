import { useEffect, useState } from "react";
import api from "@/services/api/api";
import { MousePointerClick, Clock, Eye } from "lucide-react";

import { SuperSideBar } from "./SuperSide";

interface AnalyticsStats {
  totalVisits: number;
  totalClicks: number;
  totalTimeSpent: number;
}

export function DashboardAnalytics() {
  const [stats, setStats] = useState<AnalyticsStats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await api.get("/analytics/stats");
      setStats(res.data);
    } catch (err) {
      console.error("Erro ao buscar estatísticas de analytics:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  return (
    <div className="mt-15 md:mt-0 flex flex-col md:flex-row min-h-screen bg-gray-50">
      <SuperSideBar />
      <main className="flex-1 p-4 md:p-6">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">
          Estatísticas de Acesso e Interação
        </h1>

        {loading ? (
          <p>Carregando dados...</p>
        ) : stats ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* VISITAS */}
            <div className="p-6 bg-white rounded-lg shadow flex flex-col items-center justify-center">
              <Eye className="w-10 h-10 text-blue-600 mb-2" />
              <h2 className="text-lg font-semibold mb-1 text-gray-700">Visitas</h2>
              <p className="text-3xl font-bold text-blue-700">{stats.totalVisits}</p>
            </div>

            {/* CLIQUES */}
            <div className="p-6 bg-white rounded-lg shadow flex flex-col items-center justify-center">
              <MousePointerClick className="w-10 h-10 text-green-600 mb-2" />
              <h2 className="text-lg font-semibold mb-1 text-gray-700">Cliques</h2>
              <p className="text-3xl font-bold text-green-700">{stats.totalClicks}</p>
            </div>

            {/* TEMPO MÉDIO */}
            <div className="p-6 bg-white rounded-lg shadow flex flex-col items-center justify-center">
              <Clock className="w-10 h-10 text-orange-600 mb-2" />
              <h2 className="text-lg font-semibold mb-1 text-gray-700">Tempo total</h2>
              <p className="text-2xl font-bold text-orange-700">
                {formatTime(stats.totalTimeSpent)}
              </p>
            </div>
          </div>
        ) : (
          <p>Nenhum dado encontrado.</p>
        )}
      </main>
    </div>
  );
}

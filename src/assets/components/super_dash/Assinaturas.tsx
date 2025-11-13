import { useEffect, useState } from "react";

import api from "@/services/api/api";
import toast from "react-hot-toast";
import { useAuthGuard } from "@/services/hooks/validator";
import { useRequireSubscription } from "@/services/hooks/CheckSubscription";
import { SuperSideBar } from "./SuperSide";

interface Subscription {
  id: number;
  companyId: number;
  stripeSubscriptionId: string;
  email: string;
  status: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  updatedAt: string;
  plan: string;
  isTrial: boolean;
  trialEndsAt: string;
}

export function AssinaturasCompany() {
  useAuthGuard(["SUPER_ADMIN"]);
  useRequireSubscription();

  const [assinaturas, setAssinaturas] = useState<Subscription[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 5;

  const fetchAssinaturas = async (page: number) => {
    try {
      const res = await api.get(`/subscription?page=${page}&limit=${limit}`);
      setAssinaturas(res.data.data);
      setTotalPages(res.data.pagination.totalPages);
      setPage(res.data.pagination.page);
    } catch (err) {
      console.error("Erro ao buscar assinaturas:", err);
      toast.error("Erro ao carregar assinaturas.");
    }
  };

  useEffect(() => {
    fetchAssinaturas(page);
  }, [page]);

  const handleCancel = async (id: number) => {
    toast((t) => (
      <div className="flex flex-col">
        <span>Tem certeza que deseja cancelar esta assinatura?</span>
        <div className="flex justify-end mt-2 gap-2">
          <button
            onClick={() => {
              toast.dismiss(t.id);
              cancelNow();
            }}
            className="px-2 py-1 bg-red-500 text-white rounded"
          >
            Sim
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-2 py-1 bg-gray-300 rounded"
          >
            Não
          </button>
        </div>
      </div>
    ));

    const cancelNow = async () => {
      try {
        await api.post(`/subscription/${id}/cancel`);
        toast.success("Assinatura cancelada com sucesso!");
        fetchAssinaturas(page);
      } catch (err) {
        console.error("Erro ao cancelar assinatura:", err);
        toast.error("Erro ao cancelar assinatura.");
      }
    };
  };

  const handlePrevPage = () => page > 1 && setPage(page - 1);
  const handleNextPage = () => page < totalPages && setPage(page + 1);

  return (
    <div className="flex min-h-screen">
      <SuperSideBar/>
      <div className="mt-10 md:mt-0 flex-1 p-4 md:p-6 bg-gray-50">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Assinaturas Ativas
        </h1>

        {assinaturas.length > 0 ? (
          <>
            {/* === VISÃO DESKTOP === */}
            <div className="hidden md:block overflow-x-auto rounded-lg shadow mt-4">
              <table className="w-full border-collapse bg-white text-sm md:text-base">
                <thead className="bg-gray-100 border-b">
                  <tr>
                    <th className="p-3 text-left font-semibold text-gray-700">
                      Email
                    </th>
                    <th className="p-3 text-left font-semibold text-gray-700">
                      Plano
                    </th>
                    <th className="p-3 text-left font-semibold text-gray-700">
                      Status
                    </th>
                    <th className="p-3 text-left font-semibold text-gray-700">
                      Período
                    </th>
                    <th className="p-3 text-center font-semibold text-gray-700">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {assinaturas.map((sub) => (
                    <tr
                      key={sub.id}
                      className="border-b hover:bg-gray-50 transition-colors"
                    >
                      <td className="p-3 font-medium text-gray-800">
                        {sub.email}
                      </td>
                      <td className="p-3 text-gray-700 capitalize">
                        {sub.plan}{" "}
                        {sub.isTrial && (
                          <span className="text-xs text-blue-600 ml-2 font-semibold">
                            (Trial)
                          </span>
                        )}
                      </td>
                      <td
                        className={`p-3 font-semibold ${
                          sub.status === "active"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {sub.status}
                      </td>
                      <td className="p-3 text-gray-600">
                        {new Date(sub.updatedAt).toLocaleDateString(
                          "pt-BR"
                        )}{" "}
                        —{" "}
                        {new Date(sub.trialEndsAt).toLocaleDateString(
                          "pt-BR"
                        )}
                      </td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() => handleCancel(sub.id)}
                          className="px-3 py-1 text-xs md:text-sm bg-red-500 text-white rounded hover:bg-red-600 transition"
                        >
                          Cancelar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* === VISÃO MOBILE === */}
            <div className="md:hidden mt-4 space-y-4">
              {assinaturas.map((sub) => (
                <div
                  key={sub.id}
                  className="bg-white rounded-lg shadow p-4 border border-gray-100"
                >
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-semibold text-gray-800 capitalize">
                      {sub.plan}
                    </h3>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        sub.status === "active"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {sub.status}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Email:</span> {sub.email}
                  </p>

                  {sub.isTrial && (
                    <p className="text-xs text-blue-600 mt-1 font-semibold">
                      Trial até{" "}
                      {new Date(sub.trialEndsAt).toLocaleDateString("pt-BR")}
                    </p>
                  )}

                  <p className="text-sm text-gray-600 mt-1">
                    <span className="font-medium">Período:</span>{" "}
                    {new Date(sub.currentPeriodStart).toLocaleDateString(
                      "pt-BR"
                    )}{" "}
                    —{" "}
                    {new Date(sub.currentPeriodEnd).toLocaleDateString("pt-BR")}
                  </p>

                  <div className="mt-3 flex justify-end">
                    <button
                      onClick={() => handleCancel(sub.id)}
                      className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* === PAGINAÇÃO === */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mt-6">
              <button
                onClick={handlePrevPage}
                disabled={page === 1}
                className="w-full sm:w-auto px-4 py-2 bg-gray-300 rounded disabled:opacity-50 hover:bg-gray-400 transition"
              >
                Anterior
              </button>
              <span className="text-sm font-medium text-gray-700">
                Página {page} de {totalPages}
              </span>
              <button
                onClick={handleNextPage}
                disabled={page === totalPages}
                className="w-full sm:w-auto px-4 py-2 bg-gray-300 rounded disabled:opacity-50 hover:bg-gray-400 transition"
              >
                Próxima
              </button>
            </div>
          </>
        ) : (
          <p className="text-gray-600 mt-4">Nenhuma assinatura encontrada.</p>
        )}
      </div>
    </div>
  );
}

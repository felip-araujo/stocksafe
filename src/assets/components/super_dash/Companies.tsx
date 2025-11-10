import { useEffect, useState } from "react";
import api from "@/services/api/api";
import toast from "react-hot-toast";
import { useAuthGuard } from "@/services/hooks/validator";
import { useRequireSubscription } from "@/services/hooks/CheckSubscription";
import { SuperSideBar } from "./SuperSide";
import { RotateCw } from "lucide-react";

interface Company {
  id: number;
  name: string;
  email: string;
  cnpj: string;
  createdAt: string;
  status: string;
}

export function EmpresasCadastradas() {
  useAuthGuard(["SUPER_ADMIN"]);
  useRequireSubscription();

  const [companies, setCompanies] = useState<Company[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const limit = 5;

  const fetchCompanies = async (page: number) => {
    try {
      setLoading(true);
      const res = await api.get(`/companies?page=${page}&limit=${limit}`);
      setCompanies(res.data.data);
      setTotalPages(res.data.pagination.totalPages);
      setPage(res.data.pagination.page);
    } catch (err) {
      console.error("Erro ao buscar empresas:", err);
      toast.error("Erro ao carregar empresas.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCompanies(page);
  }, [page]);

  const handleDelete = async (id: number) => {
    toast((t) => (
      <div className="flex flex-col">
        <span>Tem certeza que deseja excluir esta empresa?</span>
        <div className="flex justify-end mt-2 gap-2">
          <button
            onClick={() => {
              toast.dismiss(t.id);
              confirmDelete();
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

    const confirmDelete = async () => {
      try {
        await api.delete(`/companies/${id}`);
        toast.success("Empresa excluída com sucesso!");
        fetchCompanies(page);
      } catch (err) {
        console.error("Erro ao excluir empresa:", err);
        toast.error("Erro ao excluir empresa.");
      }
    };
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchCompanies(page);
    toast.success("Lista atualizada!");
  };

  const handlePrevPage = () => page > 1 && setPage(page - 1);
  const handleNextPage = () => page < totalPages && setPage(page + 1);

  return (
    <div className="flex min-h-screen">
      <SuperSideBar />
      <div className="mt-10 md:mt-0 flex-1 p-4 md:p-6 bg-gray-50">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-800">
            Empresas Cadastradas
          </h1>

          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition disabled:opacity-70"
          >
            <RotateCw
              className={`w-5 h-5 ${refreshing ? "animate-spin" : ""}`}
            />
            {refreshing ? "Atualizando..." : "Atualizar"}
          </button>
        </div>

        {loading ? (
          <p className="text-gray-600 mt-4">Carregando empresas...</p>
        ) : companies.length > 0 ? (
          <>
            {/* === VISÃO DESKTOP === */}
            <div className="hidden md:block overflow-x-auto rounded-lg shadow mt-4">
              <table className="w-full border-collapse bg-white text-sm md:text-base">
                <thead className="bg-gray-100 border-b">
                  <tr>
                    <th className="p-3 text-left font-semibold text-gray-700">
                      Nome
                    </th>
                    <th className="p-3 text-left font-semibold text-gray-700">
                      Email
                    </th>
                    <th className="p-3 text-left font-semibold text-gray-700">
                      CNPJ
                    </th>
                    <th className="p-3 text-left font-semibold text-gray-700">
                      Status
                    </th>
                    <th className="p-3 text-left font-semibold text-gray-700">
                      Criada em
                    </th>
                    <th className="p-3 text-center font-semibold text-gray-700">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {companies.map((company) => (
                    <tr
                      key={company.id}
                      className="border-b hover:bg-gray-50 transition-colors"
                    >
                      <td className="p-3 font-medium text-gray-800">
                        {company.name}
                      </td>
                      <td className="p-3 text-gray-700">{company.email}</td>
                      <td className="p-3 text-gray-700">
                        {company.cnpj || "-"}
                      </td>
                      <td
                        className={`p-3 font-semibold ${
                          company.status === "active"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {company.status || "—"}
                      </td>
                      <td className="p-3 text-gray-600">
                        {new Date(company.createdAt).toLocaleDateString(
                          "pt-BR"
                        )}
                      </td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() => handleDelete(company.id)}
                          className="px-3 py-1 text-xs md:text-sm bg-red-500 text-white rounded hover:bg-red-600 transition"
                        >
                          Excluir
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* === VISÃO MOBILE === */}
            <div className="md:hidden mt-4 space-y-4">
              {companies.map((company) => (
                <div
                  key={company.id}
                  className="bg-white rounded-lg shadow p-4 border border-gray-100"
                >
                  <h3 className="text-lg font-semibold text-gray-800">
                    {company.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Email:</span> {company.email}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">CNPJ:</span>{" "}
                    {company.cnpj || "Não informado"}
                  </p>
                  <p
                    className={`text-sm font-semibold mt-1 ${
                      company.status === "active"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {company.status || "—"}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Criada em:{" "}
                    {new Date(company.createdAt).toLocaleDateString("pt-BR")}
                  </p>

                  <div className="mt-3 flex justify-end">
                    <button
                      onClick={() => handleDelete(company.id)}
                      className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition"
                    >
                      Excluir
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
          <p className="text-gray-600 mt-4">Nenhuma empresa cadastrada.</p>
        )}
      </div>
    </div>
  );
}

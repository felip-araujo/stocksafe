import { useEffect, useState } from "react";
import { useAuthGuard } from "@/services/hooks/validator";
import { SidebarDash } from "./SideBarDash";
import api from "@/services/api/api";

interface Request {
  id: number;
  materialId: number;
  userId: number;
  companyId: number;
  quantity: number;
  status: string;
  createdAt: string;
}

export function RequestsCompany() {
  useAuthGuard(["COMPANY_ADMIN"]);

  const companyId = localStorage.getItem("companyId");
  const [requests, setRequests] = useState<Request[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 5; // limite fixo por página

  const fetchRequests = async (page: number) => {
    if (!companyId) return;
    try {
      const res = await api.get(`/requisicao/${companyId}?page=${page}&limit=${limit}`);
      setRequests(res.data.data);
      setTotalPages(res.data.pagination.totalPages);
      setPage(res.data.pagination.page);
      console.log(res.data.data[0].user)

      

    } catch (err) {
      console.error("Erro ao buscar requisições:", err);
    }
  };

  useEffect(() => {
    fetchRequests(page);
  }, [companyId, page]);

  const handleExclude = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir esta requisição?")) return;
    try {
      await api.delete(`/requisicao/${companyId}/${id}`);
      alert("Requisição excluída com sucesso!");
      fetchRequests(page);
    } catch (err) {
      console.error("Erro ao excluir requisição:", err);
      alert("Erro ao excluir requisição");
    }
  };

  const handlePrevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  return (
    <div className="flex min-h-screen">
      <SidebarDash />
      <div className="flex-1 p-6 bg-gray-50">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Requisições de Materiais
        </h2>

        {requests.length > 0 ? (
          <>
            <div className="overflow-x-auto rounded-lg shadow">
              <table className="w-full border-collapse bg-white">
                <thead className="bg-gray-100 border-b">
                  <tr>
                    
                    <th className="p-3 text-left text-sm font-semibold text-gray-700">Material</th>
                    <th className="p-3 text-left text-sm font-semibold text-gray-700">Usuário</th>
                    <th className="p-3 text-left text-sm font-semibold text-gray-700">Quantidade</th>
                    <th className="p-3 text-left text-sm font-semibold text-gray-700">Status</th>
                    <th className="p-3 text-left text-sm font-semibold text-gray-700">Criado em</th>
                    <th className="p-3 text-center text-sm font-semibold text-gray-700">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((req) => (
                    <tr key={req.id} className="border-b hover:bg-gray-50">
                      
                      <td className="p-3 text-sm font-medium text-gray-800">{req.material.name}</td>
                      <td className="p-3 text-sm text-gray-600">{req.user.name}</td>
                      <td className="p-3 text-sm text-gray-600">{req.quantity}</td>
                      <td className="p-3 text-sm text-gray-600 capitalize">
                        {req.status === "pending" ? (
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs">
                            Pendente
                          </span>
                        ) : req.status === "approved" ? (
                          <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                            Aprovada
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs">
                            Rejeitada
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-sm text-gray-600">
                        {new Date(req.createdAt).toLocaleDateString("pt-BR")}
                      </td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() => handleExclude(req.id)}
                          className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition"
                        >
                          Excluir
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Paginação */}
            <div className="flex justify-between mt-4">
              <button
                onClick={handlePrevPage}
                disabled={page === 1}
                className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50 hover:bg-gray-400"
              >
                Anterior
              </button>
              <span className="text-sm font-medium">
                Página {page} de {totalPages}
              </span>
              <button
                onClick={handleNextPage}
                disabled={page === totalPages}
                className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50 hover:bg-gray-400"
              >
                Próxima
              </button>
            </div>
          </>
        ) : (
          <p className="text-gray-600 mt-4">Nenhuma requisição encontrada.</p>
        )}
      </div>
    </div>
  );
}

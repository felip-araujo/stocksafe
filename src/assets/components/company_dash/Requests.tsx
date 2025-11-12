import { useEffect, useState } from "react";
import { useAuthGuard } from "@/services/hooks/validator";
import { SidebarDash } from "./SideBarDash";
import api from "@/services/api/api";
import { useRequireSubscription } from "@/services/hooks/CheckSubscription";
import toast from "react-hot-toast";

interface Request {
  id: number;
  userId: number;
  companyId: number;
  status: string;
  createdAt: string;
  user: {
    name: string;
    department?: {
      name: string;
    } | null;
  };
  items: {
    id: number;
    requestId: number;
    materialId: number;
    quantity: number;
    createdAt: string;
    material: {
      name: string;
    };
  }[];
}

export function RequestsCompany() {
  useAuthGuard(["COMPANY_ADMIN"]);
  useRequireSubscription();

  const companyId = localStorage.getItem("companyId");
  const [requests, setRequests] = useState<Request[]>([]);
  const [statusChanges, setStatusChanges] = useState<{ [key: number]: string }>({});
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const limit = 5;

  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);

  // Debounce: espera o usuário parar de digitar antes de buscar
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchRequests(page, search);
    }, 400); // 400ms de delay
    return () => clearTimeout(delayDebounce);
  }, [search, page]);

  const fetchRequests = async (page: number, searchTerm = "") => {
    if (!companyId) return;
    try {
      const res = await api.get(
        `/requisicao/${companyId}?page=${page}&limit=${limit}&search=${encodeURIComponent(searchTerm)}`
      );
      setRequests(res.data.data);
      setTotalPages(res.data.pagination.totalPages);
      setPage(res.data.pagination.page);
    } catch (err) {
      console.error("Erro ao buscar requisições:", err);
    }
  };

  useEffect(() => {
    fetchRequests(page);
  }, [companyId]);

  const handleExclude = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir esta requisição?")) return;
    try {
      await api.delete(`/requisicao/${companyId}/${id}`);
      toast.success("Requisição excluída com sucesso!");
      fetchRequests(page, search);
    } catch (err) {
      console.error("Erro ao excluir requisição:", err);
      toast.error("Erro ao excluir requisição");
    }
  };

  const handleStatusChange = (id: number, newStatus: string) => {
    setStatusChanges((prev) => ({
      ...prev,
      [id]: newStatus,
    }));
  };

  const handleUpdateStatus = async (id: number) => {
    const newStatus = statusChanges[id];
    if (!newStatus) {
      toast.error("Selecione um status antes de enviar.");
      return;
    }

    try {
      await api.put(`/requisicao/${companyId}/${id}`, { status: newStatus });
      toast.success("Status atualizado com sucesso!");
      fetchRequests(page, search);
    } catch (err) {
      console.error("Erro ao atualizar status:", err);
      toast.error("Erro ao atualizar status");
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
        {/* Campo de busca */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
          <h1 className="text-xl font-semibold text-gray-800">Requisições</h1>
          <input
            type="text"
            placeholder="Pesquisar por usuário, departamento ou item..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-80 px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
          />
        </div>

        {requests.length > 0 ? (
          <>
            {/* Tabela */}
            <div className="hidden md:block overflow-x-auto rounded-lg mt-4 shadow">
              <table className="w-full border-collapse bg-white">
                <thead className="bg-gray-100 border-b">
                  <tr>
                    <th className="p-3 text-left text-sm font-semibold text-gray-700">Material</th>
                    <th className="p-3 text-left text-sm font-semibold text-gray-700">Usuário</th>
                    <th className="p-3 text-left text-sm font-semibold text-gray-700">Departamento</th>
                    <th className="p-3 text-left text-sm font-semibold text-gray-700">Quantidade</th>
                    <th className="p-3 text-left text-sm font-semibold text-gray-700">Status</th>
                    <th className="p-3 text-left text-sm font-semibold text-gray-700">Criado em</th>
                    <th className="p-3 text-center text-sm font-semibold text-gray-700">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((req) => (
                    <tr
                      key={req.id}
                      className="border-b hover:bg-gray-50 cursor-pointer transition"
                      onClick={() => setSelectedRequest(req)}
                    >
                      <td className="p-3 text-sm font-medium text-gray-800">
                        <div className="max-h-24 overflow-y-auto custom-scrollbar">
                          {req.items.map((item) => (
                            <div key={item.id}>{item.material.name}</div>
                          ))}
                        </div>
                      </td>
                      <td className="p-3 text-sm text-gray-600">{req.user.name}</td>
                      <td className="p-3 text-sm text-gray-600">
                        {req.user.department?.name ?? "Sem departamento"}
                      </td>
                      <td className="p-3 text-sm text-gray-600">
                        <div className="max-h-24 overflow-y-auto custom-scrollbar">
                          {req.items.map((item) => (
                            <div key={item.id}>
                              {item.material.name}: {item.quantity}
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="p-3 text-sm text-gray-600">
                        <select
                          value={statusChanges[req.id] || req.status}
                          onChange={(e) => handleStatusChange(req.id, e.target.value)}
                          className={`px-2 py-1 rounded-full text-xs border focus:outline-none ${
                            req.status === "approved"
                              ? "bg-green-100 text-green-700"
                              : req.status === "rejected"
                              ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          <option value="pending">Pendente</option>
                          <option value="approved">Aprovado</option>
                          <option value="rejected">Rejeitado</option>
                        </select>
                      </td>
                      <td className="p-3 text-sm text-gray-600">
                        {new Date(req.createdAt).toLocaleDateString("pt-BR")}
                      </td>
                      <td className="p-3 text-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleExclude(req.id);
                          }}
                          className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition"
                        >
                          Excluir
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUpdateStatus(req.id);
                          }}
                          className="px-3 py-1 ml-2 text-sm bg-green-500 text-white rounded hover:bg-green-600 transition"
                        >
                          Atualizar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Paginação */}
            <div className="flex justify-between mt-4 flex-wrap gap-2">
              <button
                onClick={handlePrevPage}
                disabled={page === 1}
                className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50 hover:bg-gray-400"
              >
                Anterior
              </button>
              <span className="text-sm font-medium text-gray-700">
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
          <p className="text-gray-600 mt-15 md:mt-4">Nenhuma requisição encontrada.</p>
        )}

        {/* Modal */}
        {selectedRequest && (
          <div
            onClick={() => setSelectedRequest(null)}
            className="fixed inset-0 flex items-center justify-center bg-black/80 bg-opacity-50 backdrop-blur-sm z-50 transition-opacity animate-fadeIn"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 mx-3 transform animate-slideUp"
            >
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                Detalhes da Requisição #{selectedRequest.id}
              </h2>

              <p className="text-gray-700 mb-2">
                <strong>Usuário:</strong> {selectedRequest.user.name}
              </p>
              <p className="text-gray-700 mb-2">
                <strong>Departamento:</strong>{" "}
                {selectedRequest.user.department?.name ?? "Sem departamento"}
              </p>
              <p className="text-gray-700 mb-2">
                <strong>Status:</strong>{" "}
                {selectedRequest.status === "approved"
                  ? "Aprovado"
                  : selectedRequest.status === "rejected"
                  ? "Rejeitado"
                  : "Pendente"}
              </p>
              <p className="text-gray-700 mb-4">
                <strong>Criado em:</strong>{" "}
                {new Date(selectedRequest.createdAt).toLocaleDateString("pt-BR")}
              </p>

              <div className="border-t pt-3 max-h-60 overflow-y-auto custom-scrollbar">
                {selectedRequest.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center py-2 border-b last:border-none"
                  >
                    <span className="text-gray-800 font-medium">
                      {item.material.name}
                    </span>
                    <span className="text-gray-600">Qtd: {item.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-end mt-5">
                <button
                  onClick={() => setSelectedRequest(null)}
                  className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800 transition"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Tailwind Animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease forwards;
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease forwards;
        }
      `}</style>
    </div>
  );
}

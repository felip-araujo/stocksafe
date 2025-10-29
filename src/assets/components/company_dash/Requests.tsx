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
  const [statusChanges, setStatusChanges] = useState<{ [key: number]: string }>(
    {}
  );
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 5;

  const fetchRequests = async (page: number) => {
    if (!companyId) return;
    try {
      const res = await api.get(
        `/requisicao/${companyId}?page=${page}&limit=${limit}`
      );
      setRequests(res.data.data);
      console.log(res.data);
      setTotalPages(res.data.pagination.totalPages);
      setPage(res.data.pagination.page);
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

  const handleStatusChange = (id: number, newStatus: string) => {
    setStatusChanges((prev) => ({
      ...prev,
      [id]: newStatus,
    }));
  };

  const handleUpdateStatus = async (id: number) => {
    const newStatus = statusChanges[id];
    if (!newStatus) {
      alert("Selecione um status antes de enviar.");
      return;
    }

    try {
      await api.put(`/requisicao/${companyId}/${id}`, { status: newStatus });
      
      toast.success("Status atualizado com sucesso!")
      fetchRequests(page);
    } catch (err) {
      console.error("Erro ao atualizar status:", err);
      
      toast.error("Erro ao atualizar status")
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
        {requests.length > 0 ? (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto rounded-lg shadow">
              <table className="w-full border-collapse bg-white">
                <thead className="bg-gray-100 border-b">
                  <tr>
                    <th className="p-3 text-left text-sm font-semibold text-gray-700">
                      Material
                    </th>
                    <th className="p-3 text-left text-sm font-semibold text-gray-700">
                      Usuário
                    </th>
                    <th className="p-3 text-left text-sm font-semibold text-gray-700">
                      Quantidade
                    </th>
                    <th className="p-3 text-left text-sm font-semibold text-gray-700">
                      Status
                    </th>
                    <th className="p-3 text-left text-sm font-semibold text-gray-700">
                      Criado em
                    </th>
                    <th className="p-3 text-center text-sm font-semibold text-gray-700">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((req) => (
                    <tr key={req.id} className="border-b hover:bg-gray-50">
                      <td className="p-3 text-sm font-medium text-gray-800">
                        {/* ✅ Container rolável para muitos materiais */}
                        <div className="max-h-24 overflow-y-auto custom-scrollbar">
                          {req.items.map((item) => (
                            <div key={item.id}>{item.material.name}</div>
                          ))}
                        </div>
                      </td>

                      <td className="p-3 text-sm text-gray-600">
                        {req.user.name}
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
                          onChange={(e) =>
                            handleStatusChange(req.id, e.target.value)
                          }
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
                          onClick={() => handleExclude(req.id)}
                          className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition"
                        >
                          Excluir
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(req.id)}
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

            {/* Mobile Cards */}
            <div className="md:hidden space-y-4">
              {requests.map((req) => (
                <div
                  key={req.id}
                  className="bg-white rounded-lg shadow p-4 border border-gray-100"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h2 className="font-semibold text-gray-800 text-lg">
                        {req.items.map((item) => item.material.name).join(", ")}
                      </h2>
                      <p className="text-sm text-gray-500">
                        Solicitado por: {req.user.name}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        req.status === "approved"
                          ? "bg-green-100 text-green-700"
                          : req.status === "rejected"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {req.status === "approved"
                        ? "Aprovado"
                        : req.status === "rejected"
                        ? "Rejeitado"
                        : "Pendente"}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 mb-1">
                    <span className="font-medium text-gray-700">
                      Quantidade:
                    </span>{" "}
                    {req.items
                      .map((item) => `${item.material.name}: ${item.quantity}`)
                      .join(", ")}
                  </p>
                  <p className="text-sm text-gray-600 mb-2">
                    <span className="font-medium text-gray-700">
                      Criado em:
                    </span>{" "}
                    {new Date(req.createdAt).toLocaleDateString("pt-BR")}
                  </p>

                  {/* Status Select */}
                  <div className="mt-2">
                    <select
                      value={statusChanges[req.id] || req.status}
                      onChange={(e) =>
                        handleStatusChange(req.id, e.target.value)
                      }
                      className="w-full px-2 py-1 text-sm border rounded focus:outline-none"
                    >
                      <option value="pending">Pendente</option>
                      <option value="approved">Aprovado</option>
                      <option value="rejected">Rejeitado</option>
                    </select>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-end mt-3 gap-2">
                    <button
                      onClick={() => handleExclude(req.id)}
                      className="px-3 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600 transition"
                    >
                      Excluir
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(req.id)}
                      className="px-3 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600 transition"
                    >
                      Atualizar
                    </button>
                  </div>
                </div>
              ))}
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
          <p className="text-gray-600 mt-4">Nenhuma requisição encontrada.</p>
        )}
      </div>
    </div>
  );
}

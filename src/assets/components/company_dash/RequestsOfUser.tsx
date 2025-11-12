import { useEffect, useState } from "react";
import { SidebarDash } from "./SideBarDash";
import { CreateRequest } from "./NewRequest";
import api from "@/services/api/api";
import { useRequireSubscription } from "@/services/hooks/CheckSubscription";
import { AlertCircle, RefreshCw } from "lucide-react";

interface Request {
  id: number;
  userId: number;
  companyId: number;
  status: string;
  createdAt: string;
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

export function UserRequest() {
  useRequireSubscription();

  const userId = localStorage.getItem("id");
  const companyId = localStorage.getItem("companyId");

  const [requests, setRequests] = useState<Request[]>([]);
  const [filtered, setFiltered] = useState<Request[]>([]); // ✅ Sempre inicia como array vazio
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  // Paginação
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

  const totalPages = Math.ceil((filtered?.length || 0) / itemsPerPage);

  // Modal
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/requisicao/${companyId}/${userId}`);
      const data = Array.isArray(res.data.data) ? res.data.data : []; // ✅ Garante que é array

      setRequests(data);
      setFiltered(data);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setError("Erro ao carregar requisições.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [companyId, userId]);

  // Filtro de busca
  useEffect(() => {
    if (!Array.isArray(requests)) return;
    const filteredData = requests.filter((req) =>
      req.items.some((item) =>
        item.material.name.toLowerCase().includes(search.toLowerCase())
      )
    );
    setFiltered(filteredData);
    setPage(1);
  }, [search, requests]);

  // Paginação — ✅ Garante que filtered é array
  const start = (page - 1) * itemsPerPage;
  const paginatedData = Array.isArray(filtered)
    ? filtered.slice(start, start + itemsPerPage)
    : [];

  const nextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  const prevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  return (
    <div className="flex min-h-screen">
      <SidebarDash />

      <div className="flex-1 p-6 bg-gray-50">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Minhas Requisições
        </h2>
        <p className="flex items-center gap-2 bg-amber-200 text-zinc-700 font-medium w-full sm:w-auto mb-2 px-3 py-2 rounded-md text-sm sm:text-base">
          <AlertCircle size={18} className="flex-shrink-0" />
          <span>
            Para verificar os detalhes da requisição clique em{" "}
            <span className="font-bold">"ver detalhes"</span>
          </span>
        </p>

        <div className="mb-4 flex flex-col md:flex-row md:items-center md:flex items-center gap-3 ">
          <CreateRequest />

          {/* 🔄 Botão de atualizar com animação */}
          <button
            onClick={fetchRequests} // ✅ chama apenas ao clicar
            disabled={loading}
            className={`flex items-center  px-4 py-2 rounded font-medium text-white transition
      ${
        loading
          ? "bg-blue-400 cursor-not-allowed"
          : "bg-blue-600 hover:bg-blue-700"
      }
    `}
          >
            <RefreshCw
              size={18}
              className={`transition-transform duration-500 ${
                loading ? "animate-spin" : ""
              }`}
            />
            {loading ? "Atualizando..." : "Atualizar"}
          </button>

          <input
            type="text"
            placeholder="Buscar por material..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 w-full md:w-1/3 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        {loading ? (
          <p className="text-gray-600">Carregando...</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : filtered.length > 0 ? (
          <>
            {/* ✅ Tabela desktop */}
            <div className="hidden md:block overflow-x-auto rounded-lg shadow bg-white">
              <table className="w-full border-collapse">
                <thead className="bg-gray-100 border-b">
                  <tr>
                    <th className="p-3 text-left text-sm font-semibold text-gray-700">
                      Material
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
                    <th></th>
                  </tr>
                </thead>

                <tbody>
                  {paginatedData.map((req) => (
                    <tr
                      key={req.id}
                      className="border-b hover:bg-gray-50 cursor-pointer"
                      onClick={() => setSelectedRequest(req)}
                    >
                      <td className="p-3 text-sm text-gray-800">
                        {req.items[0]?.material.name}{" "}
                        {req.items.length > 1 && (
                          <span className="text-gray-400 text-xs">
                            (+{req.items.length - 1})
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-sm text-gray-600">
                        {req.items.reduce(
                          (sum, item) => sum + item.quantity,
                          0
                        )}
                      </td>
                      <td className="p-3 text-sm">
                        <span
                          className={`px-2 py-1 rounded-md text-xs font-semibold
                            ${
                              req.status === "pending"
                                ? "text-yellow-700 bg-yellow-100"
                                : req.status === "approved"
                                ? "text-green-700 bg-green-100"
                                : req.status === "rejected"
                                ? "text-red-700 bg-red-100"
                                : "text-gray-700 bg-gray-100"
                            }`}
                        >
                          {req.status === "pending"
                            ? "Pendente"
                            : req.status === "approved"
                            ? "Aprovado"
                            : req.status === "rejected"
                            ? "Rejeitada"
                            : req.status}
                        </span>
                      </td>
                      <td className="p-3 text-sm text-gray-600">
                        {new Date(req.createdAt).toLocaleDateString("pt-BR")}
                      </td>
                      <td className="p-3 text-right text-sm text-blue-600 underline">
                        Ver detalhes
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* ✅ Cards Mobile */}
            <div className="block md:hidden space-y-4">
              {paginatedData.map((req) => (
                <div
                  key={req.id}
                  onClick={() => setSelectedRequest(req)}
                  className="bg-white shadow rounded-lg p-4 border border-gray-200 cursor-pointer hover:shadow-md transition"
                >
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-semibold text-gray-800 text-sm">
                      {req.items[0]?.material.name}
                      {req.items.length > 1 && (
                        <span className="text-gray-400 text-xs">
                          {" "}
                          (+{req.items.length - 1})
                        </span>
                      )}
                    </h4>
                    <span
                      className={`px-2 py-1 rounded-md text-xs font-semibold
            ${
              req.status === "pending"
                ? "text-yellow-700 bg-yellow-100"
                : req.status === "approved"
                ? "text-green-700 bg-green-100"
                : req.status === "rejected"
                ? "text-red-700 bg-red-100"
                : "text-gray-700 bg-gray-100"
            }`}
                    >
                      {req.status === "pending"
                        ? "Pendente"
                        : req.status === "approved"
                        ? "Aprovado"
                        : req.status === "rejected"
                        ? "Rejeitada"
                        : req.status}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 mb-1">
                    <strong>Quantidade:</strong>{" "}
                    {req.items.reduce((sum, item) => sum + item.quantity, 0)}
                  </p>
                  <p className="text-sm text-gray-600 mb-2">
                    <strong>Criado em:</strong>{" "}
                    {new Date(req.createdAt).toLocaleDateString("pt-BR")}
                  </p>

                  <p className="text-blue-600 text-sm underline">
                    Ver detalhes
                  </p>
                </div>
              ))}
            </div>

            {/* ✅ Paginação */}
            <div className="flex justify-between mt-6">
              <button
                onClick={prevPage}
                disabled={page === 1}
                className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50 hover:bg-gray-400"
              >
                Anterior
              </button>
              <span className="text-sm font-medium text-gray-700">
                Página {page} de {totalPages || 1}
              </span>
              <button
                onClick={nextPage}
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

      {/* ✅ Modal de Detalhes */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black/80 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-11/12 md:w-1/2 p-6 relative">
            <button
              onClick={() => setSelectedRequest(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl"
            >
              ✕
            </button>
            <h3 className="text-lg font-semibold mb-4 text-gray-800">
              Detalhes da Requisição #{selectedRequest.id}
            </h3>
            <div className="max-h-80 overflow-y-auto custom-scrollbar">
              {selectedRequest.items.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between py-2 border-b border-gray-200"
                >
                  <span className="text-gray-700">{item.material.name}</span>
                  <span className="text-gray-600 font-medium">
                    {item.quantity}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 text-sm text-gray-600">
              <p>
                <strong>Status:</strong>{" "}
                {selectedRequest.status === "pending"
                  ? "Pendente"
                  : selectedRequest.status === "approved"
                  ? "Aprovado"
                  : selectedRequest.status === "rejected"
                  ? "Rejeitada"
                  : selectedRequest.status}
              </p>
              <p>
                <strong>Criado em:</strong>{" "}
                {new Date(selectedRequest.createdAt).toLocaleDateString(
                  "pt-BR"
                )}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

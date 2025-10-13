import { SidebarDash } from "./SideBarDash";
import { CreateRequest } from "./NewRequest";
import { usePaginatedFetch } from "@/services/hooks/usePaginatedFetch";

interface Request {
  id: number;
  materialId: number;
  userId: number;
  companyId: number;
  quantity: number;
  status: string;
  createdAt: string;
  material: {
    name: string;
  };
}

export function UserRequest() {
  const userId = localStorage.getItem("id");
  const companyId = localStorage.getItem("companyId");

  // ✅ Hook de paginação
  const {
    data: requests,
    page,
    totalPages,
    loading,
    error,
    nextPage,
    prevPage,
  } = usePaginatedFetch<Request>(`/requisicao/${companyId}/${userId}`, 5);

  return (
    <div className="flex min-h-screen">
      <SidebarDash />
      
      <div className="flex-1 p-6 bg-gray-50">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Minhas Requisições
        </h2>

        <CreateRequest />

        {loading ? (
          <p className="text-gray-600">Carregando...</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : requests.length > 0 ? (
          <>
            <div className="overflow-x-auto rounded-lg shadow">
              <table className="w-full border-collapse bg-white">
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
                    <th className="p-3 text-left text-sm font-semibold text-gray-700">
                      Empresa
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {requests.map((req) => (
                    <tr key={req.id} className="border-b hover:bg-gray-50">
                      <td className="p-3 text-sm font-medium text-gray-800">
                        {req.material.name}
                      </td>
                      <td className="p-3 text-sm text-gray-600">
                        {req.quantity}
                      </td>

                      <td
                        className={`p-3 text-sm font-medium rounded
                          ${req.status === "pending" ? "text-yellow-600" : ""}
                          ${req.status === "approved" ? "text-green-600" : ""}
                          ${req.status === "rejected" ? "text-red-600" : ""}`}
                      >
                        {req.status === "pending"
                          ? "Pendente"
                          : req.status === "approved"
                          ? "Aprovado"
                          : req.status === "rejected"
                          ? "Rejeitada"
                          : req.status}
                      </td>

                      <td className="p-3 text-sm text-gray-600">
                        {new Date(req.createdAt).toLocaleDateString("pt-BR")}
                      </td>

                      <td className="p-3 text-sm text-gray-600">
                        {req.companyId}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* ✅ Controles de Paginação */}
            <div className="flex justify-between mt-4">
              <button
                onClick={prevPage}
                disabled={page === 1}
                className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50 hover:bg-gray-400"
              >
                Anterior
              </button>
              <span className="text-sm font-medium">
                Página {page} de {totalPages}
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
    </div>
  );
}

import { SidebarDash } from "./SideBarDash";
import { usePaginatedFetch } from "@/services/hooks/usePaginatedFetch";
import { useRequireSubscription } from "@/services/hooks/CheckSubscription";
import { CreateSale } from "./NewSale";

interface Sale {
  id: number;
  productId: number;
  userId: number;
  companyId: number;
  buyerName: string;
  buyerCpfCnpj: string;
  buyerEmail: string;
  buyerPhone: string;
  quantity: number;
  totalPrice: number;
  createdAt: string;
  product: {
    name: string;
  };
}

export function UserSales() {
  useRequireSubscription();

  const userId = localStorage.getItem("id");
  const companyId = localStorage.getItem("companyId");

  const {
    data: sales,
    page,
    totalPages,
    loading,
    error,
    nextPage,
    prevPage,
  } = usePaginatedFetch<Sale>(`/sale/${companyId}/${userId}`, 5);

  return (
    <div className="flex min-h-screen">
      <SidebarDash />

      <div className="flex-1 p-6 bg-gray-50">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Minhas Vendas
        </h2>

        <CreateSale />

        {loading ? (
          <p className="text-gray-600">Carregando...</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : sales.length > 0 ? (
          <>
            {/* ✅ Tabela desktop */}
            <div className="hidden md:block overflow-x-auto rounded-lg shadow">
              <table className="w-full border-collapse bg-white">
                <thead className="bg-gray-100 border-b">
                  <tr>
                    <th className="p-3 text-left text-sm font-semibold text-gray-700">
                      Produto
                    </th>
                    <th className="p-3 text-left text-sm font-semibold text-gray-700">
                      Quantidade
                    </th>
                    <th className="p-3 text-left text-sm font-semibold text-gray-700">
                      Total
                    </th>
                    <th className="p-3 text-left text-sm font-semibold text-gray-700">
                      Cliente
                    </th>
                    <th className="p-3 text-left text-sm font-semibold text-gray-700">
                      Data
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {sales.map((sale) => (
                    <tr key={sale.id} className="border-b hover:bg-gray-50">
                      <td className="p-3 text-sm font-medium text-gray-800">
                        {sale.product?.name || "—"}
                      </td>
                      <td className="p-3 text-sm text-gray-600">
                        {sale.quantity}
                      </td>
                      <td className="p-3 text-sm font-semibold text-gray-800">
                        R$ {sale.totalPrice?.toFixed(2)}
                      </td>
                      <td className="p-3 text-sm text-gray-700">
                        {sale.buyerName}
                      </td>
                      <td className="p-3 text-sm text-gray-600">
                        {new Date(sale.createdAt).toLocaleDateString("pt-BR")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* ✅ Cards no mobile */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
              {sales.map((sale) => (
                <div
                  key={sale.id}
                  className="bg-white rounded-lg shadow p-4 border border-gray-200"
                >
                  <p className="font-semibold text-gray-800">
                    {sale.product?.name || "—"}
                  </p>
                  <p className="text-sm text-gray-700 mb-1">
                    <span className="font-medium">Cliente:</span>{" "}
                    {sale.buyerName}
                  </p>
                  <p className="text-sm text-gray-700 mb-1">
                    <span className="font-medium">Quantidade:</span>{" "}
                    {sale.quantity}
                  </p>
                  <p className="text-sm text-gray-700 mb-1">
                    <span className="font-medium">Total:</span> R${" "}
                    {sale.totalPrice?.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Data:</span>{" "}
                    {new Date(sale.createdAt).toLocaleDateString("pt-BR")}
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
          <p className="text-gray-600 mt-4">Nenhuma venda encontrada.</p>
        )}
      </div>
    </div>
  );
}

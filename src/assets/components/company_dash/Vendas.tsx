import { useEffect, useState } from "react";
import { useAuthGuard } from "@/services/hooks/validator";
import { SidebarDash } from "./SideBarDash";
import api from "@/services/api/api";
import { useRequireSubscription } from "@/services/hooks/CheckSubscription";
import { CreateSale } from "./NewSale";
import { formatPhone } from "@/services/hooks/AuxFunctions";
import { whatsappLink } from "@/services/hooks/AuxFunctions";
import { formatCpf } from "@/services/hooks/AuxFunctions";
// import { formatCurrency } from "@/services/hooks/AuxFunctions";

interface Venda {
  id: number;
  totalPrice: number;
  quantity: number;
  userId: number;
  productId: number;
  createdAt: string;
  buyerCpfCnpj: string;
  buyerName: string;
  buyerPhone?: string;
  product?: {
    name: string;
  };
  user?: {
    name: string;
  };
}

export function VendasCompany() {
  useAuthGuard(["COMPANY_ADMIN", "EMPLOYEE"]);
  useRequireSubscription();

  const companyId = localStorage.getItem("companyId");
  const [vendas, setVendas] = useState<Venda[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 5;

  const fetchVendas = async (page: number) => {
    if (!companyId) return;
    try {
      const res = await api.get(`/sale/${companyId}?page=${page}&limit=${limit}`);
      setVendas(res.data.data);
      setTotalPages(res.data.pagination?.totalPages || 1);
      setPage(res.data.pagination?.page || 1);
    } catch (err) {
      console.error("Erro ao buscar vendas:", err);
    }
  };

  useEffect(() => {
    fetchVendas(page);
  }, [companyId, page]);

  const handlePrevPage = () => page > 1 && setPage(page - 1);
  const handleNextPage = () => page < totalPages && setPage(page + 1);

  return (
    <div className="flex min-h-screen">
      <SidebarDash />
      <div className="flex-1 p-4 sm:p-6 bg-gray-50">
        <CreateSale />

        {vendas.length > 0 ? (
          <>
            {/* ✅ Tabela Desktop */}
            <div className="hidden md:block overflow-x-auto rounded-lg shadow">
              <table className="w-full border-collapse bg-white">
                <thead className="bg-gray-100 border-b">
                  <tr>
                    <th className="p-3 text-left text-sm font-semibold text-gray-700">Produto</th>
                    <th className="p-3 text-left text-sm font-semibold text-gray-700">Vendedor</th>
                    <th className="p-3 text-left text-sm font-semibold text-gray-700">Comprador</th>
                    <th className="p-3 text-left text-sm font-semibold text-gray-700">CPF</th>
                    <th className="p-3 text-left text-sm font-semibold text-gray-700">Whatsapp</th>
                    <th className="p-3 text-left text-sm font-semibold text-gray-700">Unidades</th>
                    <th className="p-3 text-left text-sm font-semibold text-gray-700">Total (R$)</th>
                    <th className="p-3 text-left text-sm font-semibold text-gray-700">Data</th>
                  </tr>
                </thead>
                <tbody>
                  {vendas.map((venda) => (
                    <tr key={venda.id} className="border-b hover:bg-gray-50">
                      <td className="p-3 text-sm text-gray-700">
                        {venda.product?.name || `Produto #${venda.productId}`}
                      </td>
                      <td className="p-3 text-sm text-gray-700">
                        {venda.user?.name || `Usuário #${venda.userId}`}
                      </td>
                      <td className="p-3 text-sm text-gray-700">{venda.buyerName}</td>

                      {/* ✅ CPF formatado e parcialmente mascarado */}
                      <td className="p-3 text-sm text-gray-700">
                        {venda.buyerCpfCnpj ? formatCpf(venda.buyerCpfCnpj) : "—"}
                      </td>

                      {/* ✅ Telefone com link pro WhatsApp */}
                      <td className="p-3 text-sm text-gray-700">
                        {venda.buyerPhone ? (
                          <a
                            href={whatsappLink(venda.buyerPhone)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-green-600 hover:underline font-medium"
                          >
                            {formatPhone(venda.buyerPhone)}
                          </a>
                        ) : (
                          "—"
                        )}
                      </td>

                      <td className="p-3 text-sm text-gray-700">{venda.quantity}</td>
                      <td className="p-3 text-sm text-gray-700 font-medium">
                        {venda.totalPrice.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                      </td>
                      <td className="p-3 text-sm text-gray-700">
                        {new Date(venda.createdAt).toLocaleDateString("pt-BR")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* ✅ Layout Mobile */}
            <div className="block md:hidden space-y-4 mt-4">
              {vendas.map((venda) => (
                <div key={venda.id} className="bg-white rounded-lg shadow p-4 flex flex-col text-sm">
                  <p><span className="font-semibold text-gray-700">Produto:</span> {venda.product?.name}</p>
                  <p><span className="font-semibold text-gray-700">Vendedor:</span> {venda.user?.name}</p>
                  <p><span className="font-semibold text-gray-700">Comprador:</span> {venda.buyerName}</p>
                  
                  {/* ✅ CPF mascarado */}
                  <p><span className="font-semibold text-gray-700">CPF:</span> {formatCpf(venda.buyerCpfCnpj)}</p>

                  <p>
                    <span className="font-semibold text-gray-700">Telefone:</span>{" "}
                    {venda.buyerPhone ? (
                      <a
                        href={whatsappLink(venda.buyerPhone)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-600 hover:underline font-medium"
                      >
                        {formatPhone(venda.buyerPhone)}
                      </a>
                    ) : (
                      "—"
                    )}
                  </p>
                  <p><span className="font-semibold text-gray-700">Qtd:</span> {venda.quantity}</p>
                  <p>
                    <span className="font-semibold text-gray-700">Total:</span>{" "}
                    {venda.totalPrice.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                  </p>
                  <p>
                    <span className="font-semibold text-gray-700">Data:</span>{" "}
                    {new Date(venda.createdAt).toLocaleDateString("pt-BR")}
                  </p>
                </div>
              ))}
            </div>

            {/* ✅ Paginação */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mt-6">
              <button
                onClick={handlePrevPage}
                disabled={page === 1}
                className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50 hover:bg-gray-400 w-full sm:w-auto"
              >
                Anterior
              </button>
              <span className="text-sm font-medium">
                Página {page} de {totalPages}
              </span>
              <button
                onClick={handleNextPage}
                disabled={page === totalPages}
                className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50 hover:bg-gray-400 w-full sm:w-auto"
              >
                Próxima
              </button>
            </div>
          </>
        ) : (
          <p className="mt-6 text-center text-gray-600">Nenhuma venda encontrada.</p>
        )}
      </div>
    </div>
  );
}

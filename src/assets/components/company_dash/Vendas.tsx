import { useEffect, useState } from "react";
import { useAuthGuard } from "@/services/hooks/validator";
import { SidebarDash } from "./SideBarDash";
import api from "@/services/api/api";
import { useRequireSubscription } from "@/services/hooks/CheckSubscription";
import { CreateSale } from "./NewSale";

interface Venda {
  id: number;
  totalPrice: number;
  quantity: number;
  userId: number;
  productId: number;
  createdAt: string;
  buyerCpfCnpj: string;
  buyerName: string;
  buyerPhone?: string; // 🔹 Adiciona o telefone retornado pela API
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

  const handlePrevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  // 🔹 Função para criar link de WhatsApp
  const formatPhoneForWhatsapp = (phone: string) => {
    const cleaned = phone.replace(/\D/g, ""); // remove caracteres não numéricos
    return `https://wa.me/55${cleaned}`; // adiciona código do Brasil
  };

  function formatPhoneNumber(phone: string | number): string {
  const cleaned = String(phone).replace(/\D/g, ""); // remove tudo que não for número

  if (cleaned.length === 11) {
    // Ex: 11987654321 → (11) 98765-4321
    return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  } else if (cleaned.length === 10) {
    // Ex: 1134567890 → (11) 3456-7890
    return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
  } else {
    // Retorna como está se não for um formato reconhecido
    return phone.toString();
  }
}


  return (
    <div className="flex min-h-screen">
      <SidebarDash />
      <div className="flex-1 p-4 sm:p-6 bg-gray-50">
        <CreateSale />

        {vendas.length > 0 ? (
          <>
            {/* Tabela Desktop */}
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
                      <td className="p-3 text-sm text-gray-700">
                        {venda.buyerName || `Usuário #${venda.userId}`}
                      </td>
                      <td className="p-3 text-sm text-gray-700">
                        {venda.buyerPhone ? (
                          <a
                            href={formatPhoneForWhatsapp(venda.buyerPhone)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-green-600 hover:underline font-medium"
                          >
                            
                              {formatPhoneNumber(venda.buyerPhone)}
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

            {/* Layout Mobile */}
            <div className="block md:hidden space-y-4 mt-4">
              {vendas.map((venda) => (
                <div
                  key={venda.id}
                  className="bg-white rounded-lg shadow p-4 flex flex-col text-sm"
                >
                  <p><span className="font-semibold text-gray-700">Produto:</span> {venda.product?.name}</p>
                  <p><span className="font-semibold text-gray-700">Vendedor:</span> {venda.user?.name}</p>
                  <p><span className="font-semibold text-gray-700">Comprador:</span> {venda.buyerName}</p>
                  <p><span className="font-semibold text-gray-700">Comprador:</span> {venda.buyerCpfCnpj}</p>
                  <p>
                    <span className="font-semibold text-gray-700">Telefone:</span>{" "}
                    {venda.buyerPhone ? (
                      <a
                        href={formatPhoneForWhatsapp(venda.buyerPhone)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-600 hover:underline font-medium"
                      >
                        {venda.buyerPhone}
                      </a>
                    ) : (
                      "—"
                    )}
                  </p>
                  <p><span className="font-semibold text-gray-700">Qtd:</span> {venda.quantity}</p>
                  <p><span className="font-semibold text-gray-700">Total:</span> R$ {venda.totalPrice.toFixed(2)}</p>
                  <p><span className="font-semibold text-gray-700">Data:</span> {new Date(venda.createdAt).toLocaleDateString("pt-BR")}</p>
                </div>
              ))}
            </div>

            {/* Paginação */}
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

import { useEffect, useState } from "react";
import { useAuthGuard } from "@/services/hooks/validator";
import { SidebarDash } from "./SideBarDash";
import api from "@/services/api/api";
import { CreateProduct } from "./NewProduct";
import { useRequireSubscription } from "@/services/hooks/CheckSubscription";
import toast from "react-hot-toast";
import type { AxiosError } from "axios";
import { formatCurrency } from "@/services/hooks/AuxFunctions";

interface Produto {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  createdAt: string;
  codigo: string;
}

export function ProdutosCompany() {
  useAuthGuard(["COMPANY_ADMIN", "EMPLOYEE"]);
  useRequireSubscription();

  const companyId = localStorage.getItem("companyId");
  const role = localStorage.getItem("role");
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 5;

  const fetchProdutos = async (page: number) => {
    if (!companyId) return;
    try {
      const res = await api.get(
        `/product/${companyId}?page=${page}&limit=${limit}`
      );
      setProdutos(res.data.data);
      setTotalPages(res.data.pagination.totalPages);
      setPage(res.data.pagination.page);
    } catch (err) {
      console.error("Erro ao buscar produtos:", err);
    }
  };

  useEffect(() => {
    fetchProdutos(page);
  }, [companyId, page]);

  const handleExclude = async (id: number) => {
    toast(
      (t) => (
        <div className="flex flex-col">
          <span>Tem certeza que deseja deletar?</span>
          <div className="flex justify-end mt-2 gap-2">
            <button
              onClick={() => {
                toast.dismiss(t.id); // fecha o toast
                // ação
                excludeOnce();
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
      ),
      { duration: 5000 } // tempo que o toast fica visível (opcional)
    );

    const excludeOnce = async () => {
      try {
        await api.delete(`/product/${companyId}/${id}`);
        alert("Produto excluído com sucesso!");
        fetchProdutos(page);
      } catch (err) {
        const error = err as AxiosError<{ message: string }>;
        const mensagem = error.response?.data?.message || "Erro inesperado";
        console.error(mensagem);
        toast.error(mensagem);
      }
    };
  };

  const handlePrevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  // Nova função acima do return:
  const handleUpdateStock = async (id: number, newStock: number) => {
    try {
      await api.put(`/product/${companyId}/${id}`, { stock: newStock });

      // Atualiza o estado local para refletir a mudança
      setProdutos((prev) =>
        prev.map((p) => (p.id === id ? { ...p, stock: newStock } : p))
      );
    } catch (err) {
      console.error("Erro ao atualizar estoque:", err);
      alert("Erro ao atualizar estoque");
    }
  };

  const handleUpdateProduct = async (
    id: number,
    data: { stock?: number; codigo?: string }
  ) => {
    try {
      await api.put(`/product/${companyId}/${id}`, data);

      // Atualiza localmente o estado
      setProdutos((prev) =>
        prev.map((p) => (p.id === id ? { ...p, ...data } : p))
      );
      console.log("Produto atualizado com sucesso!");
    } catch (err) {
      console.error("Erro ao atualizar produto:", err);
      alert("Erro ao atualizar produto");
    }
  };

  return (
    <div className="flex min-h-screen">
      <SidebarDash />
      <div className="flex-1 p-4 sm:p-6 bg-gray-50">
        {role === "EMPLOYEE" && (
          <h1 className="text-xl font-semibold text-gray-800 mb-6">
            Produtos Estoque
          </h1>
        )}

        {role !== "EMPLOYEE" && (
          <CreateProduct onCreated={() => fetchProdutos(page)} />
        )}

        {produtos.length > 0 ? (
          <>
            {/* Tabela Desktop */}
            <div className="hidden md:block overflow-x-auto rounded-lg shadow">
              <table className="w-full border-collapse bg-white">
                <thead className="bg-gray-100 border-b">
                  <tr>
                    <th className="p-3 text-left text-sm font-semibold text-gray-700">
                      Nome
                    </th>

                    <th className="p-3 text-left text-sm font-semibold text-gray-700">
                      Descrição
                    </th>

                    <th className="p-3 text-left text-sm font-semibold text-gray-700">
                      Código
                    </th>

                    <th className="p-3 text-left text-sm font-semibold text-gray-700">
                      Preço
                    </th>

                    <th className="p-3 text-left text-sm font-semibold text-gray-700">
                      Estoque
                    </th>

                    <th className="p-3 text-left text-sm font-semibold text-gray-700">
                      Criado em
                    </th>
                    {role !== "EMPLOYEE" && (
                      <th className="p-3 text-center text-sm font-semibold text-gray-700">
                        Ações
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {produtos.map((produto) => (
                    <tr key={produto.id} className="border-b hover:bg-gray-50">
                      <td className="p-3 text-sm font-medium text-gray-800">
                        {produto.name}
                      </td>
                      <td className="p-3 text-sm text-gray-600">
                        {produto.description}
                      </td>
                      <td className="p-3 text-sm text-gray-600">
                        {role !== "EMPLOYEE" && (
                          <input
                            type="text"
                            value={produto.codigo || ""}
                            onChange={(e) => {
                              const newCode = e.target.value;

                              // Atualiza localmente no estado
                              setProdutos((prev) =>
                                prev.map((p) =>
                                  p.id === produto.id
                                    ? { ...p, codigo: newCode }
                                    : p
                                )
                              );
                            }}
                            onBlur={() =>
                              handleUpdateProduct(produto.id, {
                                codigo: produto.codigo,
                              })
                            }
                            className="border px-2 py-1 rounded w-full"
                          />
                        )}
                        {role === "EMPLOYEE" && <p>{produto.codigo}</p>}
                      </td>
                      <td className="p-3 text-sm text-gray-600">
                        {formatCurrency(produto.price)}
                        
                      </td>

                      <td className="p-3 text-sm text-gray-600 flex items-center gap-2">
                        {role !== "EMPLOYEE" && (
                          <button
                            onClick={() =>
                              handleUpdateStock(
                                produto.id,
                                Math.max(produto.stock - 1, 0)
                              )
                            }
                            className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                          >
                            -
                          </button>
                        )}

                        {role !== "EMPLOYEE" && (
                          <input
                            type="number"
                            value={produto.stock}
                            onChange={(e) => {
                              const newStock = Number(e.target.value);
                              setProdutos((prev) =>
                                prev.map((p) =>
                                  p.id === produto.id
                                    ? { ...p, stock: newStock }
                                    : p
                                )
                              );
                            }}
                            onBlur={(e) => {
                              const newStock = Number(e.target.value);
                              handleUpdateStock(produto.id, newStock);
                            }}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                const newStock = Number(e.currentTarget.value);
                                handleUpdateStock(produto.id, newStock);
                                e.currentTarget.blur(); // sai do input
                              }
                            }}
                            className="w-16 text-center border rounded px-1 py-0.5 focus:outline-none focus:ring-2 focus:ring-blue-400"
                          />
                        )}

                        {role === "EMPLOYEE" && <p>{produto.stock}</p>}

                        {role !== "EMPLOYEE" && (
                          <button
                            onClick={() =>
                              handleUpdateStock(produto.id, produto.stock + 1)
                            }
                            className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                          >
                            +
                          </button>
                        )}
                      </td>

                      <td className="p-3 text-sm text-gray-600">
                        {new Date(produto.createdAt).toLocaleDateString(
                          "pt-BR"
                        )}
                      </td>
                      {role !== "EMPLOYEE" && (
                        <td className="p-3 text-center">
                          <button
                            onClick={() => handleExclude(produto.id)}
                            className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition"
                          >
                            Excluir
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Layout Mobile */}
            <div className="block md:hidden space-y-4 mt-4">
              {produtos.map((produto) => (
                <div
                  key={produto.id}
                  className="bg-white rounded-lg shadow p-4 flex flex-col text-sm"
                >
                  <p>
                    <span className="font-semibold text-gray-700">Nome:</span>{" "}
                    {produto.name}
                  </p>
                  <p>
                    <span className="font-semibold text-gray-700">
                      Descrição:
                    </span>{" "}
                    {produto.description}
                  </p>
                  <p>
                    <span className="font-semibold text-gray-700">Preço:</span>{" "}
                    R$ {produto.price.toFixed(2)}
                  </p>
                  <p>
                    <span className="font-semibold text-gray-700">
                      Estoque:
                    </span>{" "}
                    {produto.stock}
                  </p>
                  <p>
                    <span className="font-semibold text-gray-700">
                      Criado em:
                    </span>{" "}
                    {new Date(produto.createdAt).toLocaleDateString("pt-BR")}
                  </p>
                  {role !== "EMPLOYEE" && (
                    <button
                      onClick={() => handleExclude(produto.id)}
                      className="mt-3 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                    >
                      Excluir
                    </button>
                  )}
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
          <p className="mt-6 text-center text-gray-600">
            Nenhum produto encontrado.
          </p>
        )}
      </div>
    </div>
  );
}

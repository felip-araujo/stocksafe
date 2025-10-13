import { useEffect, useState } from "react";
import { useAuthGuard } from "@/services/hooks/validator";
import { SidebarDash } from "./SideBarDash";
import api from "@/services/api/api";
import { CreateProduct } from "./NewProduct";

interface Produto {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  createdAt: string;
}

export function ProdutosCompany() {
  useAuthGuard(["COMPANY_ADMIN", "EMPLOYEE"]);

  const companyId = localStorage.getItem("companyId");
  const role = localStorage.getItem("role"); 
  console.log(role)
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 5; // limite fixo por página

  const fetchProdutos = async (page: number) => {
    if (!companyId) return;
    try {
      const res = await api.get(`/product/${companyId}?page=${page}&limit=${limit}`);
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
    if (!confirm("Tem certeza que deseja excluir este produto?")) return;
    try {
      await api.delete(`/product/${companyId}/${id}`);
      alert("Produto excluído com sucesso!");
      fetchProdutos(page); // atualiza a lista da página atual
    } catch (err) {
      console.error("Erro ao excluir produto:", err);
      alert("Erro ao excluir produto");
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
       {role !== "EMPLOYEE" && ( <CreateProduct onCreated={() => fetchProdutos(page)} /> )}

        {produtos.length > 0 ? (
          <>
            <div className="overflow-x-auto rounded-lg shadow">
              <table className="w-full border-collapse bg-white">
                <thead className="bg-gray-100 border-b">
                  <tr>
                    <th className="p-3 text-left text-sm font-semibold text-gray-700">ID</th>
                    <th className="p-3 text-left text-sm font-semibold text-gray-700">Nome</th>
                    <th className="p-3 text-left text-sm font-semibold text-gray-700">Descrição</th>
                    <th className="p-3 text-left text-sm font-semibold text-gray-700">Preço</th>
                    <th className="p-3 text-left text-sm font-semibold text-gray-700">Estoque</th>
                    <th className="p-3 text-left text-sm font-semibold text-gray-700">Criado em</th>
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
                      <td className="p-3 text-sm text-gray-600">{produto.id}</td>
                      <td className="p-3 text-sm font-medium text-gray-800">{produto.name}</td>
                      <td className="p-3 text-sm text-gray-600">{produto.description}</td>
                      <td className="p-3 text-sm text-gray-600">R$ {produto.price.toFixed(2)}</td>
                      <td className="p-3 text-sm text-gray-600">{produto.stock}</td>
                      <td className="p-3 text-sm text-gray-600">
                        {new Date(produto.createdAt).toLocaleDateString("pt-BR")}
                      </td>
                     {role !== "EMPLOYEE" &&  ( <td className="p-3 text-center">
                       <button
                          onClick={() => handleExclude(produto.id)}
                          className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition"
                        >
                          Excluir
                        </button>
                      </td> )}
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
          <p>Nenhum produto encontrado.</p>
        )}
      </div>
    </div>
  );
}

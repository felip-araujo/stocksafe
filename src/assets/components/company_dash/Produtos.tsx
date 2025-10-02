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
  useAuthGuard(["COMPANY_ADMIN"]);

  const companyId = localStorage.getItem("companyId");
  const [produtos, setProdutos] = useState<Produto[]>([]);

  useEffect(() => {
    if (companyId) {
      api
        .get(`/product/${companyId}`)
        .then((res) => {
          setProdutos(res.data);
        })
        .catch((err) => {
          console.error("Erro ao buscar produtos:", err);
        });
    }
  }, [companyId]);

  const handleExclude = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir este produto?")) return;
    try {
      const res = await api.delete(`/product/${companyId}/${id}`);
      alert("Produto Excluído com Sucesso!");
      console.log(res);
      setProdutos((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Erro ao excluir produto:", err);
      alert("Erro ao excluir produto");
    }

    console.log(id);
  };

  return (
    <div className="flex min-h-screen">
      <SidebarDash></SidebarDash>

      <div className="flex-1 p-6 bg-gray-50">
        <CreateProduct></CreateProduct>
        {/* <h1 className="text-xl font-bold mb-4">Produtos</h1> */}
        {produtos.length > 0 ? (
          <div className="overflow-x-auto rounded-lg shadow">
            <table className="w-full border-collapse bg-white">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="p-3 text-left text-sm font-semibold text-gray-700">
                    ID
                  </th>
                  <th className="p-3 text-left text-sm font-semibold text-gray-700">
                    Nome
                  </th>
                  <th className="p-3 text-left text-sm font-semibold text-gray-700">
                    Descrição
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
                  <th className="p-3 text-center text-sm font-semibold text-gray-700">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody>
                {produtos.map((produto) => (
                  <tr key={produto.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 text-sm text-gray-600">{produto.id}</td>
                    <td className="p-3 text-sm font-medium text-gray-800">
                      {produto.name}
                    </td>
                    <td className="p-3 text-sm text-gray-600">
                      {produto.description}
                    </td>
                    <td className="p-3 text-sm text-gray-600">
                      R$ {produto.price.toFixed(2)}
                    </td>
                    <td className="p-3 text-sm text-gray-600">
                      {produto.stock}
                    </td>
                    <td className="p-3 text-sm text-gray-600">
                      {new Date(produto.createdAt).toLocaleDateString("pt-BR")}
                    </td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => handleExclude(produto.id)}
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
        ) : (
          <p>Nenhum produto encontrado.</p>
        )}
      </div>
    </div>
  );
}

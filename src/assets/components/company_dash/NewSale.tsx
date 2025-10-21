import { useEffect, useState } from "react";
import api from "@/services/api/api";
import toast from "react-hot-toast";

interface Produtos {
  id: number;
  name: string;
  stock: number;
}

export function CreateSale({ onCreated }: { onCreated?: () => void }) {
  const companyId = Number(localStorage.getItem("companyId"));
  const userId = Number(localStorage.getItem("id"));
  const [produtos, setProdutos] = useState<Produtos[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [estoqueAtual, setEstoqueAtual] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    productId: "",
    buyerName: "",
    buyerCpfCnpj: "",
    buyerEmail: "",
    buyerPhone: "",
    quantity: 1,
  });

  // Carrega os produtos ao abrir o modal
  useEffect(() => {
    if (!isOpen) return;
    const fetchProdutos = async () => {
      try {
        const res = await api.get(`/product/${companyId}`);
        setProdutos(res.data.data || []);
      } catch (err) {
        console.error("Erro ao buscar produtos:", err);
        toast.error("Erro ao carregar produtos");
      }
    };
    fetchProdutos();
  }, [isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: id === "quantity" ? Number(value) : value,
    }));

    // Atualiza o estoque quando o produto for selecionado
    if (id === "productId") {
      const produtoSelecionado = produtos.find((p) => p.id === Number(value));
      setEstoqueAtual(produtoSelecionado ? produtoSelecionado.stock : null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyId || !userId) {
      toast.error("Erro: empresa ou usuário não encontrado.");
      return;
    }

    if (!formData.productId) {
      toast.error("Selecione um produto antes de registrar a venda.");
      return;
    }

    try {
      setLoading(true);
      const body = {
        ...formData,
        userId,
      };

      const res = await api.post(`/sale/${companyId}`, body);
      toast.success("Venda registrada com sucesso!");
      console.log("Venda criada:", res.data);

      // Resetar formulário
      setFormData({
        productId: "",
        buyerName: "",
        buyerCpfCnpj: "",
        buyerEmail: "",
        buyerPhone: "",
        quantity: 1,
      });
      setEstoqueAtual(null);
      setIsOpen(false);
      if (onCreated) onCreated();
    } catch (err) {
      console.error("Erro ao registrar venda:", err);
      toast.error("Erro ao registrar venda");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="bg-green-600 p-2 rounded mb-4 text-white font-medium"
      >
        Nova Venda
      </button>

      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 bg-opacity-20 z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-2xl shadow-lg">
            <h2 className="text-xl font-bold mb-4">Registrar Venda</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* GRID DE DUAS COLUNAS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-1">
                  <label
                    htmlFor="productId"
                    className="block text-sm font-medium mb-1"
                  >
                    Produto
                  </label>
                  <select
                    id="productId"
                    value={formData.productId}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Selecione um produto</option>
                    {produtos.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                  {estoqueAtual !== null && (
                    <p className="text-xs text-gray-600 mt-1">
                      <strong>Estoque disponível:</strong> {estoqueAtual}
                    </p>
                  )}
                </div>

                <div className="col-span-1">
                  <label
                    htmlFor="quantity"
                    className="block text-sm font-medium mb-1"
                  >
                    Quantidade
                  </label>
                  <input
                    type="number"
                    id="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    min={1}
                    required
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div className="col-span-1">
                  <label
                    htmlFor="buyerName"
                    className="block text-sm font-medium mb-1"
                  >
                    Nome do comprador
                  </label>
                  <input
                    id="buyerName"
                    value={formData.buyerName}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div className="col-span-1">
                  <label
                    htmlFor="buyerCpfCnpj"
                    className="block text-sm font-medium mb-1"
                  >
                    CPF/CNPJ
                  </label>
                  <input
                    id="buyerCpfCnpj"
                    value={formData.buyerCpfCnpj}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div className="col-span-1">
                  <label
                    htmlFor="buyerEmail"
                    className="block text-sm font-medium mb-1"
                  >
                    E-mail
                  </label>
                  <input
                    type="email"
                    id="buyerEmail"
                    value={formData.buyerEmail}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div className="col-span-1">
                  <label
                    htmlFor="buyerPhone"
                    className="block text-sm font-medium mb-1"
                  >
                    Telefone
                  </label>
                  <input
                    id="buyerPhone"
                    value={formData.buyerPhone}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>

              {/* BOTÕES */}
              <div className="flex justify-end space-x-2 mt-6">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-60"
                >
                  {loading ? "Salvando..." : "Registrar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

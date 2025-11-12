import { useEffect, useState } from "react";
import api from "@/services/api/api";
import { Plus, Minus, X, Search } from "lucide-react";
import toast from "react-hot-toast";

interface Material {
  id: number;
  name: string;
  [key: string]: unknown;
}

interface SelectedMaterial {
  materialId: number;
  quantity: number;
}

export function CreateRequest() {
  const companyId = Number(localStorage.getItem("companyId"));
  const userId = Number(localStorage.getItem("id"));

  const [isOpen, setIsOpen] = useState(false);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [selectedMaterials, setSelectedMaterials] = useState<SelectedMaterial[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Buscar materiais ao abrir o modal ou ao digitar na busca
  useEffect(() => {
    if (isOpen) {
      const fetchMaterials = async () => {
        try {
          setLoading(true);
          const res = await api.get(`/material/${companyId}?search=${search}`);
          setMaterials(res.data.data || []);
        } catch (err) {
          console.error("Erro ao buscar materiais:", err);
        } finally {
          setLoading(false);
        }
      };

      // debounce leve (aguarda 400ms antes de buscar novamente)
      const timer = setTimeout(fetchMaterials, 400);
      return () => clearTimeout(timer);
    }
  }, [isOpen, search, companyId]);

  // ✅ Selecionar/deselecionar material
  const handleSelect = (materialId: number) => {
    setSelectedMaterials((prev) => {
      const exists = prev.some((m) => m.materialId === materialId);
      return exists
        ? prev.filter((m) => m.materialId !== materialId)
        : [...prev, { materialId, quantity: 1 }];
    });
  };

  // ✅ Alterar quantidade
  const handleQuantityChange = (materialId: number, newQuantity: number) => {
    setSelectedMaterials((prev) =>
      prev.map((m) =>
        m.materialId === materialId
          ? { ...m, quantity: Math.max(1, newQuantity) }
          : m
      )
    );
  };

  // ✅ Enviar requisição
  const handleSubmit = async () => {
    try {
      await api.post(`/requisicao/${companyId}`, {
        userId,
        items: selectedMaterials.map((item) => ({
          materialId: item.materialId,
          quantity: item.quantity,
        })),
      });
      toast.success("Requisição criada com sucesso!");
      setIsOpen(false);
      setSelectedMaterials([]);
      setSearch("");
    } catch (err) {
      console.error("Erro ao criar requisição:", err);
      toast.error("Erro ao criar requisição!");
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="bg-green-600 p-2 rounded  text-white font-medium"
      >
        Nova Requisição
      </button>

      {isOpen && (
        <div className="fixed z-10 inset-0 bg-black/40 flex justify-center items-center px-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 relative animate-fade-in">
            {/* ❌ Fechar modal */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
            >
              <X size={20} />
            </button>

            <h2 className="text-xl font-bold mb-4 text-gray-800">
              Selecionar Materiais
            </h2>

            {/* 🔍 Campo de busca */}
            <div className="flex items-center gap-2 mb-4 border border-gray-300 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-green-500">
              <Search size={18} className="text-gray-500" />
              <input
                type="text"
                placeholder="Buscar material..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full outline-none text-gray-700"
              />
            </div>

            {/* 📦 Lista de materiais */}
            {loading ? (
              <p className="text-gray-500">Carregando materiais...</p>
            ) : materials.length === 0 ? (
              <p className="text-gray-500">Nenhum material encontrado.</p>
            ) : (
              <div className="max-h-80 overflow-y-auto rounded-md border">
                {materials.map((mat) => {
                  const selected = selectedMaterials.find(
                    (m) => m.materialId === mat.id
                  );
                  return (
                    <div
                      key={mat.id}
                      className={`flex items-center justify-between border-b py-2 px-2 transition-colors ${
                        selected ? "bg-green-50" : "hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={!!selected}
                          onChange={() => handleSelect(mat.id)}
                          className="h-4 w-4 accent-green-600"
                        />
                        <span className="text-gray-800 font-medium">
                          {mat.name}
                        </span>
                      </div>

                      {selected && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              handleQuantityChange(
                                mat.id,
                                selected.quantity - 1
                              )
                            }
                            className="p-1 rounded bg-gray-200 hover:bg-gray-300"
                          >
                            <Minus size={14} />
                          </button>
                          <input
                            type="number"
                            value={selected.quantity}
                            onChange={(e) =>
                              handleQuantityChange(
                                mat.id,
                                Number(e.target.value)
                              )
                            }
                            className="w-12 text-center border rounded"
                            min="1"
                          />
                          <button
                            onClick={() =>
                              handleQuantityChange(
                                mat.id,
                                selected.quantity + 1
                              )
                            }
                            className="p-1 rounded bg-gray-200 hover:bg-gray-300"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* ✅ Botão confirmar */}
            <button
              onClick={handleSubmit}
              disabled={selectedMaterials.length === 0}
              className={`mt-4 w-full py-2 rounded font-bold transition ${
                selectedMaterials.length === 0
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-green-600 text-white hover:bg-green-700"
              }`}
            >
              Confirmar Requisição
            </button>
          </div>
        </div>
      )}
    </>
  );
}

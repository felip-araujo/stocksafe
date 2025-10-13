import { useEffect, useState } from "react";
import api from "@/services/api/api";
import { Plus, Minus, X } from "lucide-react";

interface Material {
  id: number;
  name: string;

  [key: string]: unknown; // caso venha mais campos da API
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

  // Carregar materiais ao abrir o modal
  useEffect(() => {
    if (isOpen) {
      const fetchMaterials = async () => {
        try {
          const res = await api.get(`/material/${companyId}`);
          setMaterials(res.data.data);
        } catch (err) {
          console.error("Erro ao buscar materiais:", err);
        }
      };
      fetchMaterials();
    }
  }, [isOpen]);

  // Lidar com seleção de materiais
  const handleSelect = (materialId: number) => {
    if (selectedMaterials.some((m) => m.materialId === materialId)) {
      setSelectedMaterials(
        selectedMaterials.filter((m) => m.materialId !== materialId)
      );
    } else {
      setSelectedMaterials([...selectedMaterials, { materialId, quantity: 1 }]);
    }
  };

  // Alterar quantidade
  const handleQuantityChange = (materialId: number, newQuantity: number) => {
    setSelectedMaterials((prev) =>
      prev.map((m) =>
        m.materialId === materialId
          ? { ...m, quantity: Math.max(1, newQuantity) }
          : m
      )
    );
  };

  // Enviar requisição
  const handleSubmit = async () => {
    try {
      for (const item of selectedMaterials) {
        await api.post(`/requisicao/${companyId}`, {
          materialId: item.materialId,
          userId,
          companyId,
          quantity: item.quantity,
        });
      }
      alert("Requisição criada com sucesso!");
      setIsOpen(false);
      setSelectedMaterials([]);
    } catch (err) {
      console.error("Erro ao criar requisição:", err);
      alert("Erro ao criar requisição.");
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="bg-green-600 p-2 rounded mb-4 text-white font-medium"
      >
        Nova Requisição
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 relative">
            {/* Fechar modal */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
            >
              <X size={20} />
            </button>

            <h2 className="text-xl font-bold mb-4 text-gray-800">
              Selecionar Materiais
            </h2>

            {materials.length === 0 ? (
              <p className="text-gray-500">Nenhum material disponível.</p>
            ) : (
              <div className="max-h-80 overflow-y-auto">
                {materials.map((mat) => {
                  const selected = selectedMaterials.find(
                    (m) => m.materialId === mat.id
                  );
                  return (
                    <div
                      key={mat.id}
                      className={`flex items-center justify-between border-b py-2 px-2 ${
                        selected ? "bg-green-50" : ""
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

            <button
              onClick={handleSubmit}
              disabled={selectedMaterials.length === 0}
              className={`mt-4 w-full py-2 rounded font-bold ${
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

import { useEffect, useState } from "react";
import { useAuthGuard } from "@/services/hooks/validator";
import { SidebarDash } from "./SideBarDash";
import api from "@/services/api/api";
import { NewMaterial } from "./NewMaterial";

interface Material {
  id: number;
  name: string;
  description: string;
  group: string;
  createdAt: string;
}

export function MaterialsCompany() {
  useAuthGuard(["COMPANY_ADMIN", "EMPLOYEE"]);

  const role = localStorage.getItem("role");
  const companyId = localStorage.getItem("companyId");
  const [materials, setMaterials] = useState<Material[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 5; // limite fixo por página

  const fetchMaterials = async (page: number) => {
    if (!companyId) return;
    try {
      const res = await api.get(
        `/material/${companyId}?page=${page}&limit=${limit}`
      );
      setMaterials(res.data.data);
      setTotalPages(res.data.pagination.totalPages);
      setPage(res.data.pagination.page);
    } catch (err) {
      console.error("Erro ao buscar materiais:", err);
    }
  };

  useEffect(() => {
    fetchMaterials(page);
  }, [companyId, page]);

  const handleExclude = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir este material?")) return;
    try {
      await api.delete(`/material/${companyId}/${id}`);
      alert("Material excluído com sucesso!");
      fetchMaterials(page);
    } catch (err) {
      console.error("Erro ao excluir material:", err);
      alert("Erro ao excluir material");
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
        {role !== "EMPLOYEE" && (<NewMaterial  />)}

        {materials.length > 0 ? (
          <>
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
                      Grupo
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
                  {materials.map((material) => (
                    <tr key={material.id} className="border-b hover:bg-gray-50">
                      <td className="p-3 text-sm text-gray-600">
                        {material.id}
                      </td>
                      <td className="p-3 text-sm font-medium text-gray-800">
                        {material.name}
                      </td>
                      <td className="p-3 text-sm text-gray-600">
                        {material.description}
                      </td>
                      <td className="p-3 text-sm text-gray-600">
                        {material.group}
                      </td>
                      <td className="p-3 text-sm text-gray-600">
                        {new Date(material.createdAt).toLocaleDateString(
                          "pt-BR"
                        )}
                      </td>
                      <td className="p-3 text-center">
                        {role !== "EMPLOYEE" && (
                          <button
                            onClick={() => handleExclude(material.id)}
                            className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition"
                            id="exclude-btn"
                          >
                            Excluir
                          </button>
                        )}
                      </td>
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
          <p className="text-gray-600 mt-4">Nenhum material encontrado.</p>
        )}
      </div>
    </div>
  );
}

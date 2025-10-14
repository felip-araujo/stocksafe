import { useEffect, useState } from "react";
import { useAuthGuard } from "@/services/hooks/validator";
import { SidebarDash } from "./SideBarDash";
import api from "@/services/api/api";
import { CreateUser } from "./NewUser";

interface Usuario {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export function UsuariosCompany() {
  useAuthGuard(["COMPANY_ADMIN"]);

  const companyId = localStorage.getItem("companyId");
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 5;

  const fetchUsuarios = async (page: number) => {
    if (!companyId) return;
    try {
      const res = await api.get(`/user/${companyId}?page=${page}&limit=${limit}`);
      setUsuarios(res.data.data);
      setTotalPages(res.data.pagination.totalPages);
      setPage(res.data.pagination.page);
    } catch (err) {
      console.error("Erro ao buscar usuários:", err);
    }
  };

  useEffect(() => {
    fetchUsuarios(page);
  }, [companyId, page]);

  const handleExclude = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir este usuário?")) return;
    try {
      await api.delete(`/user/${companyId}/${id}`);
      alert("Usuário excluído com sucesso!");
      fetchUsuarios(page);
    } catch (err) {
      console.error("Erro ao excluir usuário:", err);
      alert("Erro ao excluir usuário");
    }
  };

  const handlePrevPage = () => page > 1 && setPage(page - 1);
  const handleNextPage = () => page < totalPages && setPage(page + 1);

  return (
    <div className="flex min-h-screen">
      <SidebarDash />

      <div className="flex-1 p-4 md:p-6 bg-gray-50">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Usuários da Empresa</h2>
        <CreateUser onCreated={() => fetchUsuarios(page)} />

        {usuarios.length > 0 ? (
          <>
            {/* === VISÃO DESKTOP === */}
            <div className="hidden md:block overflow-x-auto rounded-lg shadow mt-4">
              <table className="w-full border-collapse bg-white text-sm md:text-base">
                <thead className="bg-gray-100 border-b">
                  <tr>
                    <th className="p-3 text-left font-semibold text-gray-700">ID</th>
                    <th className="p-3 text-left font-semibold text-gray-700">Nome</th>
                    <th className="p-3 text-left font-semibold text-gray-700">Email</th>
                    <th className="p-3 text-left font-semibold text-gray-700">Função</th>
                    <th className="p-3 text-left font-semibold text-gray-700">Criado em</th>
                    <th className="p-3 text-center font-semibold text-gray-700">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {usuarios.map((usuario) => (
                    <tr
                      key={usuario.id}
                      className="border-b hover:bg-gray-50 transition-colors"
                    >
                      <td className="p-3 text-gray-600">{usuario.id}</td>
                      <td className="p-3 font-medium text-gray-800">{usuario.name}</td>
                      <td className="p-3 text-gray-600 truncate max-w-[200px]">
                        {usuario.email}
                      </td>
                      <td className="p-3 text-gray-600 capitalize">
                        {usuario.role === "COMPANY_ADMIN"
                          ? "Administrador"
                          : usuario.role === "EMPLOYEE"
                          ? "Funcionário"
                          : usuario.role}
                      </td>
                      <td className="p-3 text-gray-600">
                        {new Date(usuario.createdAt).toLocaleDateString("pt-BR")}
                      </td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() => handleExclude(usuario.id)}
                          className="px-3 py-1 text-xs md:text-sm bg-red-500 text-white rounded hover:bg-red-600 transition"
                        >
                          Excluir
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* === VISÃO MOBILE === */}
            <div className="md:hidden mt-4 space-y-4">
              {usuarios.map((usuario) => (
                <div
                  key={usuario.id}
                  className="bg-white rounded-lg shadow p-4 border border-gray-100"
                >
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {usuario.name}
                    </h3>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        usuario.role === "COMPANY_ADMIN"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {usuario.role === "COMPANY_ADMIN"
                        ? "Administrador"
                        : "Funcionário"}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Email:</span> {usuario.email}
                  </p>

                  <p className="text-sm text-gray-600 mt-1">
                    <span className="font-medium">ID:</span> {usuario.id}
                  </p>

                  <p className="text-sm text-gray-600 mt-1">
                    <span className="font-medium">Criado em:</span>{" "}
                    {new Date(usuario.createdAt).toLocaleDateString("pt-BR")}
                  </p>

                  <div className="mt-3 flex justify-end">
                    <button
                      onClick={() => handleExclude(usuario.id)}
                      className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition"
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* === PAGINAÇÃO === */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mt-6">
              <button
                onClick={handlePrevPage}
                disabled={page === 1}
                className="w-full sm:w-auto px-4 py-2 bg-gray-300 rounded disabled:opacity-50 hover:bg-gray-400 transition"
              >
                Anterior
              </button>
              <span className="text-sm font-medium text-gray-700">
                Página {page} de {totalPages}
              </span>
              <button
                onClick={handleNextPage}
                disabled={page === totalPages}
                className="w-full sm:w-auto px-4 py-2 bg-gray-300 rounded disabled:opacity-50 hover:bg-gray-400 transition"
              >
                Próxima
              </button>
            </div>
          </>
        ) : (
          <p className="text-gray-600 mt-4">Nenhum usuário encontrado.</p>
        )}
      </div>
    </div>
  );
}

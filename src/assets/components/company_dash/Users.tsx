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

  useEffect(() => {
    if (companyId) {
      api
        .get(`/user/${companyId}`)
        .then((res) => {
          setUsuarios(res.data);
        })
        .catch((err) => {
          console.error("Erro ao buscar usuários:", err);
        });
    }
  }, [companyId]);

  const handleExclude = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir este usuário?")) return;
    try {
      const res = await api.delete(`/user/${companyId}/${id}`);
      alert("Usuário excluído com sucesso!");
      console.log(res);
      setUsuarios((prev) => prev.filter((u) => u.id !== id));
    } catch (err) {
      console.error("Erro ao excluir usuário:", err);
      alert("Erro ao excluir usuário");
    }
  };

  return (
    <div className="flex min-h-screen">
      <SidebarDash />

      <div className="flex-1 p-6 bg-gray-50">
        <h1 className="text-xl font-bold mb-4">Usuários da Empresa</h1>
      <CreateUser></CreateUser>

        {usuarios.length > 0 ? (
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
                    Email
                  </th>
                  <th className="p-3 text-left text-sm font-semibold text-gray-700">
                    Função
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
                {usuarios.map((usuario) => (
                  <tr key={usuario.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 text-sm text-gray-600">{usuario.id}</td>
                    <td className="p-3 text-sm font-medium text-gray-800">
                      {usuario.name}
                    </td>
                    <td className="p-3 text-sm text-gray-600">{usuario.email}</td>
                    <td className="p-3 text-sm text-gray-600">{usuario.role}</td>
                    <td className="p-3 text-sm text-gray-600">
                      {new Date(usuario.createdAt).toLocaleDateString("pt-BR")}
                    </td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => handleExclude(usuario.id)}
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
          <p>Nenhum usuário encontrado.</p>
        )}
      </div>
    </div>
  );
}

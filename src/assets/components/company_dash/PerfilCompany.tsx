import { useEffect, useState } from "react";
import { useAuthGuard } from "@/services/hooks/validator";
import { SidebarDash } from "./SideBarDash";
import api from "@/services/api/api";
import { useRequireSubscription } from "@/services/hooks/CheckSubscription";

interface UserData {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export function PerfilCompany() {
  useAuthGuard(["COMPANY_ADMIN", "EMPLOYEE"]);
  useRequireSubscription()

  const companyId = localStorage.getItem("companyId");
  const userId = localStorage.getItem("id");

  const [userData, setUserData] = useState<UserData | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [updating, setUpdating] = useState(false);

  // 🔹 Busca dados do usuário
  const fetchUserData = async () => {
    if (!companyId || !userId) return;
    try {
      const res = await api.get(`/user/${companyId}/${userId}`);
      setUserData(res.data.data);
      console.log(res.data.data);
    } catch (err) {
      console.error("Erro ao buscar dados do usuário:", err);
    }
  };

  console.log(userData);

  useEffect(() => {
    fetchUserData();
  }, [companyId, userId]);

  // 🔹 Função para alterar senha
  const handleChangePassword = async () => {
    if (!newPassword.trim()) {
      alert("Por favor, insira uma nova senha.");
      return;
    }
    try {
      setUpdating(true);
      await api.put(`/user/alterar-senha/${companyId}/${userId}`, {
        newPassword,
      });
      alert("Senha alterada com sucesso!");
      setNewPassword("");
    } catch (err) {
      console.error("Erro ao alterar senha:", err);
      alert("Erro ao alterar senha. Tente novamente.");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SidebarDash />
      <div className="flex-1 p-8">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">
          Meu Perfil
        </h1>

        {userData ? (
          <div className="bg-white shadow rounded-xl p-6 mb-6 max-w-lg">
            <div className="mb-4">
              <p className="text-gray-500 text-sm">Nome</p>
              <p className="text-gray-800 font-medium">{userData.name}</p>
            </div>
            <div className="mb-4">
              <p className="text-gray-500 text-sm">E-mail</p>
              <p className="text-gray-800 font-medium">{userData.email}</p>
            </div>
            <div className="mb-4">
              <p className="text-gray-500 text-sm">Função</p>
              <p className="text-gray-800 font-medium">
                {userData.role === "COMPANY_ADMIN"
                  ? "Administrador"
                  : "Funcionário"}
              </p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Criado em</p>
              <p className="text-gray-800 font-medium">
                {new Date(userData.createdAt).toLocaleDateString("pt-BR")}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-gray-600">Não foi possível carregar os dados.</p>
        )}

        {/* Formulário de alteração de senha */}
        <div className="bg-white shadow rounded-xl p-6 max-w-lg">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Alterar Senha
          </h2>
          <input
            type="password"
            placeholder="Nova senha"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 mb-4"
          />
          <button
            onClick={handleChangePassword}
            disabled={updating}
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition disabled:opacity-50"
          >
            {updating ? "Alterando..." : "Salvar Nova Senha"}
          </button>
        </div>
      </div>
    </div>
  );
}

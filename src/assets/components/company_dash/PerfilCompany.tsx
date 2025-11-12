import { useEffect, useState } from "react";
import { useAuthGuard } from "@/services/hooks/validator";
import { SidebarDash } from "./SideBarDash";
import api from "@/services/api/api";
import { useRequireSubscription } from "@/services/hooks/CheckSubscription";
import { Eye, EyeOff, PlusCircle, Trash2, RefreshCcw } from "lucide-react";
import { UpgradePlan } from "../signature/FazerUpgrade";
import { CancelarAssinatura } from "../signature/CancelarAssinaturaBtn";
import { SuperSideBar } from "../super_dash/SuperSide";

interface UserData {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

interface Department {
  id: number;
  name: string;
  createdAt: string;
}

export function PerfilCompany() {
  useAuthGuard(["COMPANY_ADMIN", "EMPLOYEE", "SUPER_ADMIN"]);
  useRequireSubscription();

  const planoAtual = localStorage.getItem("plano");
  const companyId = localStorage.getItem("companyId");
  const userId = localStorage.getItem("id");
  const role = localStorage.getItem("role");

  const [userData, setUserData] = useState<UserData | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [updating, setUpdating] = useState(false);

  const [departments, setDepartments] = useState<Department[]>([]);
  const [newDeptName, setNewDeptName] = useState("");
  const [loadingDepts, setLoadingDepts] = useState(false);

  // 🔹 Buscar dados do usuário
  const fetchUserData = async () => {
    if (!companyId || !userId) return;
    try {
      const res = await api.get(`/user/${companyId}/${userId}`);
      setUserData(res.data.data);
    } catch (err) {
      console.error("Erro ao buscar dados do usuário:", err);
    }
  };

  // 🔹 Buscar departamentos da empresa
  const fetchDepartments = async () => {
    if (!companyId) return;
    try {
      setLoadingDepts(true);
      const res = await api.get(`/department/company/${companyId}`);
      setDepartments(res.data);
    } catch (err) {
      console.error("Erro ao buscar departamentos:", err);
    } finally {
      setLoadingDepts(false);
    }
  };

  useEffect(() => {
    fetchUserData();
    fetchDepartments();
  }, [companyId, userId]);

  // 🔹 Alterar senha
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

  // 🔹 Criar novo departamento
  const handleCreateDepartment = async () => {
    if (!newDeptName.trim()) {
      alert("Digite o nome do departamento.");
      return;
    }
    try {
      await api.post("/department", {
        companyId,
        name: newDeptName,
      });
      setNewDeptName("");
      fetchDepartments();
    } catch (err) {
      console.error("Erro ao criar departamento:", err);
      alert("Erro ao criar departamento.");
    }
  };

  // 🔹 Excluir departamento
  const handleDeleteDepartment = async (id: number) => {
    const confirmDelete = window.confirm(
      "Deseja realmente excluir este departamento?"
    );
    if (!confirmDelete) return;
    try {
      await api.delete(`/department/${id}`);
      setDepartments((prev) => prev.filter((d) => d.id !== id));
    } catch (err) {
      console.error("Erro ao excluir departamento:", err);
      alert("Erro ao excluir departamento.");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {role === "SUPER_ADMIN" ? <SuperSideBar /> : <SidebarDash />}

      <div className="flex-1 mt-10 p-4 md:p-8">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">
          Perfil da Empresa
        </h1>

        {userData ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl">
            {/* Dados do Usuário */}
            <div className="bg-white shadow rounded-xl p-4 md:p-6 flex flex-col gap-3">
              <div>
                <p className="text-gray-500 text-sm">Nome</p>
                <p className="text-gray-800 font-medium truncate">
                  {userData.name}
                </p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">E-mail</p>
                <p className="text-gray-800 font-medium truncate">
                  {userData.email}
                </p>
              </div>
              <div>
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
                {role !== "EMPLOYEE" && planoAtual !== "gold" && (
                  <UpgradePlan />
                )}
              </div>
            </div>

            {/* Alterar Senha */}
            <div className="bg-white shadow rounded-xl p-4 md:p-6 flex flex-col gap-3 relative">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">
                Alterar Senha
              </h2>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Nova senha"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <button
                onClick={handleChangePassword}
                disabled={updating}
                className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition disabled:opacity-50"
              >
                {updating ? "Alterando..." : "Salvar Nova Senha"}
              </button>
              {role !== "EMPLOYEE" && <CancelarAssinatura />}
            </div>

            {/* Departamentos */}
            {role !== "EMPLOYEE" && (
              <div className="bg-white shadow rounded-xl p-4 md:p-6 flex flex-col gap-3 col-span-1 md:col-span-2">
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-lg font-semibold text-gray-800">
                    Departamentos
                  </h2>
                  <button
                    onClick={fetchDepartments}
                    className="flex items-center gap-2 bg-blue-500 text-white px-3 py-1.5 rounded-lg hover:bg-blue-600 transition"
                  >
                    <RefreshCcw size={16} />
                    Atualizar
                  </button>
                </div>

                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    placeholder="Nome do departamento"
                    value={newDeptName}
                    onChange={(e) => setNewDeptName(e.target.value)}
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                  <button
                    onClick={handleCreateDepartment}
                    className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                  >
                    <PlusCircle size={18} />
                    Criar
                  </button>
                </div>

                <div className="mt-3">
                  {loadingDepts ? (
                    <p>Carregando departamentos...</p>
                  ) : departments.length > 0 ? (
                    <ul className="divide-y divide-gray-200">
                      {departments.map((dept) => (
                        <li
                          key={dept.id}
                          className="py-2 flex justify-between items-center hover:bg-gray-50 rounded-md px-2"
                        >
                          <div>
                            <span className="font-medium">{dept.name}</span>
                            <p className="text-sm text-gray-500">
                              Criado em{" "}
                              {new Date(dept.createdAt).toLocaleDateString(
                                "pt-BR"
                              )}
                            </p>
                          </div>
                          <button
                            onClick={() => handleDeleteDepartment(dept.id)}
                            className="text-red-600 hover:text-red-800 transition"
                            title="Excluir departamento"
                          >
                            <Trash2 size={18} />
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-600">
                      Nenhum departamento cadastrado.
                    </p>
                  )}
                </div>
              </div>
            )}  
          </div>
        ) : (
          <p className="text-gray-600">Não foi possível carregar os dados.</p>
        )}
      </div>
    </div>
  );
}

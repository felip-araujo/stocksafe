import { useState, useEffect, type JSX } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "@/services/api/api";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";
import { LogoNome } from "../logo/Logo&Nome";

type FormState = {
  name: string;
  email: string;
  password: string;
};

type Department = {
  id: string;
  name: string;
};

export function RegisterInvite(): JSX.Element {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const inviteToken = searchParams.get("invite");
  const companyId = localStorage.getItem("companyId");

  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    password: "",
  });

  const [passwordStrength, setPasswordStrength] = useState<
    "Fraca" | "Média" | "Forte" | ""
  >("");

  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const [departments, setDepartments] = useState<Department[]>([]);
  const [departmentId, setDepartmentId] = useState<string>("");

  // === Buscar departamentos ===
  useEffect(() => {
    if (!companyId) return;
    api
      .get(`/department/company/${companyId}`)
      .then((res) => setDepartments(res.data))
      .catch(() => toast.error("Erro ao carregar departamentos"));
  }, [companyId]);

  // === Avaliar força da senha ===
  const checkPasswordStrength = (
    password: string
  ): "Fraca" | "Média" | "Forte" | "" => {
    if (!password) return "";
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    if (strength <= 1) return "Fraca";
    if (strength === 2) return "Média";
    return "Forte";
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    if (name === "password") {
      setPasswordStrength(checkPasswordStrength(value));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!inviteToken) {
      toast.error("Token de convite inválido ou ausente.");
      return;
    }

    if (!departmentId) {
      toast.error("Selecione um departamento!");
      return;
    }

    try {
      setLoading(true);
      await api.post("/register", {
        name: form.name,
        email: form.email,
        password: form.password,
        inviteToken,
        departmentId, // ⬅️ agora enviando no body
      });

      toast.success(
        "Cadastro concluído com sucesso! Faça login para continuar."
      );
      setForm({ name: "", email: "", password: "" });
      setDepartmentId("");
      setPasswordStrength("");

      setTimeout(() => navigate("/auth"), 3000);
    } catch (err: unknown) {
      const message =
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (err as any)?.response?.data?.message ||
        (err as Error).message ||
        "Erro ao registrar o usuário.";
      toast.error(message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const searchInvit = async () => {
    const resToken = await api.get("/invite", {
      params: {
        token: inviteToken,
      },
    });

    localStorage.setItem("companyId", resToken.data.resInv[0].companyId);
  };
  searchInvit();

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 px-4">
      <div className="bg-white shadow-md rounded-xl p-8 w-full max-w-md">
        <LogoNome />

        <p className="text-gray-500 text-center mb-6">
          Para criar sua conta e acessar todos os recursos, preencha os campos
          abaixo com suas informações.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Nome completo
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Seu nome completo"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              E-mail
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="seu@email.com"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Departamento
            </label>
            <select
              required
              value={departmentId}
              onChange={(e) => setDepartmentId(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">Selecione...</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                  
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Senha
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full border rounded-lg px-3 py-2 pr-10 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Crie uma senha segura"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>

            {form.password && (
              <p
                className={`mt-2 text-sm font-medium ${
                  passwordStrength === "Forte"
                    ? "text-green-600"
                    : passwordStrength === "Média"
                    ? "text-yellow-600"
                    : "text-red-600"
                }`}
              >
                Força da senha: {passwordStrength}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white font-medium py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? "Cadastrando..." : "Cadastrar"}
          </button>

          <p className="text-sm mt-4 text-gray-400 text-center">
            Ao se cadastrar, você concorda com os{" "}
            <a
              href="/termos-de-uso"
              className="font-semibold text-gray-600 underline"
            >
              Termos de Uso
            </a>{" "}
            e{" "}
            <a
              href="/politica"
              className="font-semibold text-gray-600 underline"
            >
              Políticas de Privacidade
            </a>
            .
          </p>
        </form>
      </div>
    </div>
  );
}

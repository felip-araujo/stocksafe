import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/services/api/api";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import { LogoNome } from "../components/logo/Logo&Nome";


export function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await api.post("/auth", formData);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.user.role);
      localStorage.setItem("id", res.data.user.id);
      localStorage.setItem("companyId", res.data.user.companyId);
      localStorage.setItem("companyName", res.data.user.company.name);
      localStorage.setItem("representant", res.data.user.company.representant);

      const funcao = res.data.user.role;

      toast.success("Login realizado com sucesso!");

      if (funcao === "SUPER_ADMIN") navigate("/superdash");
      if (funcao === "COMPANY_ADMIN") navigate("/dashboard");
      if (funcao === "EMPLOYEE") navigate("/dash-employee");

      setFormData({ email: "", password: "" });
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 401) {
          toast.error("Usuário ou senha incorretos");
        } else {
          toast.error("Erro ao fazer login. Tente novamente.");
        }
      } else {
        toast.error("Erro inesperado ao tentar login.");
      }
    }
  };

  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      {/* Card de Login */}
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-6 sm:p-8">
        {/* Logo + Nome */}
        <LogoNome />

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email:
            </label>
            <input
              type="email"
              placeholder="Email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium mb-1"
            >
              Senha:
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Senha"
                id="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10 text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700 transition-colors"
          >
            Entrar
          </button>
        </form>

        {/* Links */}
        <div className="mt-4 text-right space-y-2">
          <a className="text-blue-600 text-sm hover:underline"
           href="/assinatura/necessaria">
            Cadastre-se
          </a>
          <br />
          <a
            className="text-blue-600 text-sm hover:underline"
            href="/esqueci-senha"
          >
            Esqueceu a senha?
          </a>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;

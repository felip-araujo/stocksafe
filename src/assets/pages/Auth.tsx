import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/services/api/api";
import axios from "axios";
import { PackagePlus, Eye, EyeOff } from "lucide-react";

export function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "error" | "success" } | null>(null);
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

      if (funcao === "SUPER_ADMIN") navigate("/superdash");
      if (funcao === "COMPANY_ADMIN") navigate("/dashboard");
      if (funcao === "EMPLOYEE") navigate("/dash-employee");

      setFormData({ email: "", password: "" });
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setToast({
          message: err.response?.status === 401 ? "Usuário ou senha incorretos" : "Erro no login",
          type: "error",
        });
      } else {
        setToast({
          message: "Erro inesperado no login",
          type: "error",
        });
      }
    }
  };

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed bottom-5 left-1/2 transform -translate-x-1/2 w-[90%] max-w-xs p-3 rounded shadow-md font-bold text-center z-50 ${
            toast.type === "error" ? "bg-red-500 text-white" : "bg-green-500 text-white"
          }`}
        >
          <span>{toast.message}</span>
          <button
            onClick={() => setToast(null)}
            className="ml-4 text-white font-bold hover:text-gray-200 transition-colors"
          >
            ✕
          </button>
        </div>
      )}

      {/* Card de Login */}
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-6 sm:p-8">
        {/* Logo + Nome */}
        <div className="flex flex-col sm:flex-row items-center justify-center mb-6">
          <div className="p-3 bg-blue-500 rounded-lg flex items-center justify-center mb-3 sm:mb-0 sm:mr-3">
            <a href="/" className="text-white font-bold">
              <PackagePlus />
            </a>
          </div>
          <a href="/" className="text-center sm:text-left">
            <p className="text-zinc-900 text-2xl font-semibold">StockSafe</p>
          </a>
        </div>

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
            <label htmlFor="password" className="block text-sm font-medium mb-1">
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
        <div className="mt-4 text-center space-y-2">
          <a className="text-blue-600 text-sm hover:underline" href="/cadastro">
            Cadastre-se
          </a>
          <br />
          <a className="text-blue-600 text-sm hover:underline" href="/esqueci-senha">
            Esqueceu a senha?
          </a>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;

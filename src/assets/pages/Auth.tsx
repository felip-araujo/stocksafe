// import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/services/api/api";
import axios from "axios";
import { PackagePlus } from "lucide-react";

export function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [toast, setToast] = useState<{
    message: string;
    type: "error" | "success";
  } | null>(null);

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await api.post("/auth", formData);

      console.log("Login realizado", res.data);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.user.role);
      localStorage.setItem("id", res.data.user.id);
      localStorage.setItem("companyId", res.data.user.companyId);
      localStorage.setItem("companyName", res.data.user.company.name);
      localStorage.setItem("representant", res.data.user.company.representant);
      const funcao = res.data.user.role;
      console.log(res.data);

      if (funcao === "SUPER_ADMIN") {
        navigate("/superdash");
      }
      if (funcao === "COMPANY_ADMIN") {
        navigate("/dashboard");
      }

      if (funcao === "EMPLOYEE") {
        navigate("/dash-employee");
      }

      setFormData({
        email: "",
        password: "",
      });
    } catch (err: unknown) {
      console.error("Erro no login", err);
      if (axios.isAxiosError(err)) {
        setToast({
          message:
            err.response?.status === 401
              ? "Usuário ou senha incorretos"
              : "Erro no login",
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
  // Faz o toast desaparecer após 3 segundos
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  return (
    <>
      <div className="items-center flex justify-center h-screen bg-gray-100">
        {/* Toast */}
        {toast && (
          <div
            className={`absolute bottom-10 right-5 w-full max-w-2xs p-2.5 rounded shadow-md font-bold text-center ${
              toast.type === "error"
                ? "bg-red-500 rounded  text-white"
                : "bg-green-500 text-white"
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
        <div className="max-w-lg mx-auto p-8 bg-white rounded-lg shadow-md ">
          {/* Logo + Texto */}
          <div className="flex items-center justify-center">
            <div className="p-4 bg-blue-500 rounded-lg items-center justify-center">
              <a className="text-white font-bold" href="/">
                <PackagePlus />
              </a>
            </div>
            <a href="/">
              <p className="text-zinc-900 text-2xl font-medium ml-2">
                StockSafe
              </p>
            </a>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 space-x-18">
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email:
            </label>
            <input
              type="email"
              placeholder="Email:"
              id="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <label
              htmlFor="password"
              className="block text-sm font-medium mb-1"
            >
              Senha:
            </label>
            <input
              type="password"
              placeholder="Senha:"
              id="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="w-full py-2 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700 transition-colors"
            >
              Enviar
            </button>
          </form>
          <div className="mt-2 align-middle ">
            <a className="text-gray-800 justify-end text-sm" href="/cadastro">
              Cadastre-se
            </a>{" "}
            <br />
            <a className="text-gray-800 text-sm" href="/esqueci-senha">
              Esqueceu a senha?
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

export default LoginPage;

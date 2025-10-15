import { useState } from "react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import { LogoNome } from "../components/logo/Logo&Nome";
import { Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";

export function CadastroComp() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [formData, setFormData] = useState({
    name: "",
    cnpj: "",
    representant: "",
    rep_email: "",
    rep_num: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/companies`,
        formData
      );

      const companyId = res.data.company.id;
      if (!companyId) throw new Error("Erro: ID da empresa não retornado.");

      localStorage.setItem("companyId", companyId);

      toast.success("Empresa cadastrada com sucesso!");

      const priceId = searchParams.get("priceId");

      const subRes = await axios.post(
        `${import.meta.env.VITE_API_URL}/subscription/${companyId}/subscribe`,
        { priceId }
      );

      if (subRes.data?.url) {
        window.location.href = subRes.data.url;
      } else {
        navigate("/auth");
      }

      setFormData({
        name: "",
        cnpj: "",
        representant: "",
        rep_email: "",
        rep_num: "",
        password: "",
      });
    } catch (err) {
      console.error(err);
      toast.error("Erro ao cadastrar empresa. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-10">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl p-8 md:p-10">
        {/* Header com logo e título */}
        <div className="flex items-center justify-center mb-6">
          <div className="flex items-center gap-4">
            <LogoNome />
            <h2 className="text-2xl font-semibold text-gray-800 pl-4 border-l border-gray-300">
              Cadastre sua Empresa
            </h2>
          </div>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
          <div className="flex flex-col">
            <label htmlFor="name" className="text-sm font-medium mb-1">
              Nome da Empresa:
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="cnpj" className="text-sm font-medium mb-1">
              CNPJ:
            </label>
            <input
              type="text"
              id="cnpj"
              value={formData.cnpj}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="representant" className="text-sm font-medium mb-1">
              Representante:
            </label>
            <input
              type="text"
              id="representant"
              value={formData.representant}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="rep_email" className="text-sm font-medium mb-1">
              Email do Representante:
            </label>
            <input
              type="email"
              id="rep_email"
              value={formData.rep_email}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="rep_num" className="text-sm font-medium mb-1">
              Contato do Representante:
            </label>
            <input
              type="text"
              id="rep_num"
              value={formData.rep_num}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>

          <div className="flex flex-col relative">
            <label htmlFor="password" className="text-sm font-medium mb-1">
              Senha Representante:
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-gray-600 hover:text-gray-800"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          <div className="md:col-span-2 mt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all disabled:bg-gray-400"
            >
              {loading ? "Cadastrando..." : "Cadastrar Empresa"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

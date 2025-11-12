import { useState } from "react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import { LogoNome } from "../components/logo/Logo&Nome";
import {  Eye, EyeOff } from "lucide-react";
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
  const [passwordError, setPasswordError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });

    // ✅ Verificação de senha forte (sem alterar a lógica principal)
    if (id === "password") {
      const strongPassword =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
      if (!strongPassword.test(value)) {
        setPasswordError(
          "A senha deve ter no mínimo 8 caracteres, incluindo letra maiúscula, minúscula, número e caractere especial."
        );
      } else {
        setPasswordError("");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // ✅ Impede envio se a senha não for forte
    const strongPassword =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!strongPassword.test(formData.password)) {
      toast.error("A senha não atende aos requisitos de segurança.");
      return;
    }

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
        localStorage.setItem("checkout", subRes.data.url);
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
        {/* Header com logo e texto de instrução */}
        <div className="flex flex-col items-center justify-center mb-8 text-center">
          <LogoNome />
          <p className="text-gray-600 text-sm sm:text-base mt-3 max-w-md">
            Preencha o formulário abaixo para continuar com seu cadastro.
          </p>
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
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 ${
                  passwordError
                    ? "border-red-500 focus:ring-red-500"
                    : "focus:ring-blue-500"
                } outline-none pr-10`}
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

            {/* ✅ Exibe requisitos da senha */}
            {passwordError ? (
              <p className="text-xs text-red-500 mt-1">{passwordError}</p>
            ) : formData.password ? (
              <p className="text-xs text-green-600 mt-1">
                Senha forte e válida!
              </p>
            ) : (
              <p className="text-xs text-gray-500 mt-1">
                A senha deve conter 8+ caracteres, letra maiúscula, minúscula,
                número e caractere especial.
              </p>
            )}
          </div>

          <div className="md:col-span-2 mt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all disabled:bg-gray-400"
            >
              {loading ? "Cadastrando..." : "Cadastrar Empresa"}
            </button>

            <p className="text-sm mt-4 text-gray-600 text-center">
              Ao se cadastrar, você concorda com os nossos{" "}
              <a
                href="/termos-de-uso"
                className="font-semibold text-blue-600 hover:text-blue-700 underline transition-colors"
              >
                Termos de Uso
              </a>
              , e{" "}
              <a
                href="/politica"
                className="font-semibold text-blue-600 hover:text-blue-700 underline transition-colors"
              >
                Políticas de Privacidade
              </a>
              .
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

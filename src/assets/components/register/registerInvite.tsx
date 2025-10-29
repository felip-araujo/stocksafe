import { useState, type JSX } from "react";
import { useSearchParams } from "react-router-dom";
import api from "@/services/api/api";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { LogoNome } from "../logo/Logo&Nome";

type FormState = {
  name: string;
  email: string;
  password: string;
};

export function RegisterInvite(): JSX.Element {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const inviteToken = searchParams.get("invite");

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

  // === Avalia força da senha (tipada) ===
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

  // === Handlers tipados ===
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

    try {
      setLoading(true);
      await api.post("/register", {
        name: form.name,
        email: form.email,
        password: form.password,
        inviteToken,
      });

      toast.success(
        "Cadastro concluído com sucesso! Faça login para continuar."
      );

      setForm({ name: "", email: "", password: "" });
      setPasswordStrength("");
      setTimeout(() => {
        navigate("/auth");
      }, 3000);
    } catch (err: unknown) {
      // tratamento seguro do erro
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

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 px-4">
      <div className="bg-white shadow-md rounded-xl p-8 w-full max-w-md">
        <LogoNome />

        <p className="text-gray-500 text-center mb-6">
          Para criar sua conta e acessar todos os recursos, preencha
          os campos abaixo com suas informações.
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
                aria-describedby="password-strength"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-gray-700"
                aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>

            {form.password && (
              <>
                <p
                  id="password-strength"
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

                {/* dica visual com requisitos */}
                <ul className="mt-2 text-xs text-gray-500 space-y-1">
                  <li
                    className={form.password.length >= 8 ? "text-gray-700" : ""}
                  >
                    • Mínimo 8 caracteres
                  </li>
                  <li
                    className={
                      /[A-Z]/.test(form.password) ? "text-gray-700" : ""
                    }
                  >
                    • Uma letra maiúscula
                  </li>
                  <li
                    className={
                      /[0-9]/.test(form.password) ? "text-gray-700" : ""
                    }
                  >
                    • Pelo menos um número
                  </li>
                  <li
                    className={
                      /[^A-Za-z0-9]/.test(form.password) ? "text-gray-700" : ""
                    }
                  >
                    • Um caractere especial (ex: !@#$%)
                  </li>
                </ul>
              </>
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
              Ao se cadastrar, você concorda com os {" "}
              <a
                href="/termos-de-uso"
                className="font-semibold text-gray-600 hover:text-gray-700 underline transition-colors"
              >
                Termos de Uso
              </a>
              , e{" "}
              <a
                href="/politica"
                className="font-semibold text-gray-600 hover:text-gray-700 underline transition-colors"
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

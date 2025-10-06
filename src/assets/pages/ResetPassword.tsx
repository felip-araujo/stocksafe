import { useState } from "react";
import type { FormEvent } from "react";
import { useParams } from "react-router-dom";
import api from "@/services/api/api";
import { Eye, EyeOff } from "lucide-react"; // usar lucide-react para os ícones

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const { token } = useParams<{ token: string }>();

  // Validação de senha forte
  const validatePassword = (pwd: string) => {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(pwd);
  };

  // Validações em tempo real
  const passwordValidations = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password),
    special: /[@$!%*?&]/.test(password),
    match: password === confirmPassword,
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!token) {
      setError("Token inválido ou expirado.");
      return;
    }

    if (!validatePassword(password)) {
      setError(
        "A senha deve ter no mínimo 8 caracteres, incluir maiúscula, minúscula, número e caractere especial."
      );
      return;
    }

    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    try {
      await api.post("/auth/reset-password", { token, password });
      setSuccess("Senha redefinida com sucesso! Agora você já pode fazer login.");
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError("Erro ao redefinir senha.");
      console.error(err);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-lg w-96"
      >
        <h2 className="text-xl font-bold mb-4">Redefinir Senha</h2>

        {error && <p className="text-red-500 mb-2">{error}</p>}
        {success && <p className="text-green-600 mb-2">{success}</p>}

        <div className="mb-3 relative">
          <label className="block text-sm font-medium">Nova Senha</label>
          <input
            type={showPassword ? "text" : "password"}
            className="w-full border rounded p-2 mt-1"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Digite sua nova senha"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-2 top-9"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        
        </div>

        <div className="mb-3 relative">
          <label className="block text-sm font-medium">Confirmar Senha</label>
          <input
            type={showConfirmPassword ? "text" : "password"}
            className="w-full border rounded p-2 mt-1"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirme sua nova senha"
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword((prev) => !prev)}
            className="absolute right-2 top-9"
          >
            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
          {confirmPassword && !passwordValidations.match && (
            <p className="text-red-500 text-xs mt-1">As senhas não coincidem</p>
          )}
        </div>

          {/* Validações em tempo real */}
          <ul className="text-xs mt-1 mb-6">
             <li className={passwordValidations.length ? "text-green-600" : "text-red-500"}>
              Mínimo 8 caracteres
            </li>
            <li className={passwordValidations.uppercase ? "text-green-600" : "text-red-500"}>
              Uma letra maiúscula
            </li>
            <li className={passwordValidations.lowercase ? "text-green-600" : "text-red-500"}>
              Uma letra minúscula
            </li>
            <li className={passwordValidations.number ? "text-green-600" : "text-red-500"}>
              Um número
            </li>
            <li className={passwordValidations.special ? "text-green-600" : "text-red-500"}>
              Um caractere especial
            </li>
          </ul>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Redefinir Senha
        </button>
      </form>
    </div>
  );
}

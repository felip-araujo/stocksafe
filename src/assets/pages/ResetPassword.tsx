import { useState } from "react";
import type { FormEvent } from "react";
import api from "@/services/api/api";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // token da URL
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get("token");

  // Validação de senha forte
  const validatePassword = (pwd: string) => {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(pwd);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!token) {
      setError("Token inválido ou expirado.");
      return;
    }

    // Senhas iguais?
    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    // Senha forte?
    if (!validatePassword(password)) {
      setError(
        "A senha deve ter no mínimo 8 caracteres, incluir maiúscula, minúscula, número e caractere especial."
      );
      return;
    }

    try {
      await api.post("/auth/reset-password", { token, password });
      setSuccess(
        "Senha redefinida com sucesso! Agora você já pode fazer login."
      );
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError("Erro ao redefinir senha.");
      console.error(err)
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

        <div className="mb-3">
          <label className="block text-sm font-medium">Nova Senha</label>
          <input
            type="password"
            className="w-full border rounded p-2 mt-1"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Digite sua nova senha"
            required
          />
        </div>

        <div className="mb-3">
          <label className="block text-sm font-medium">Confirmar Senha</label>
          <input
            type="password"
            className="w-full border rounded p-2 mt-1"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirme sua nova senha"
            required
          />
        </div>

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

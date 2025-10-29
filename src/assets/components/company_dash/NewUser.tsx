import { useState } from "react";
import api from "@/services/api/api";
import toast from "react-hot-toast";
import type { AxiosError } from "axios";

export function CreateUser({ onCreated }: { onCreated?: () => void }) {
  const companyId = Number(localStorage.getItem("companyId"));

  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "EMPLOYEE",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyId) return;

    try {
      // Inclui companyId no corpo
      const res = await api.post(`/user`, { ...formData, companyId });

      toast.success("Usuário criado com sucesso!");
      console.log(res);
      setIsOpen(false);
      setFormData({ name: "", email: "", password: "", role: "EMPLOYEE" });
      if (onCreated) onCreated(); // callback p/ atualizar lista de usuários
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      const mensagem = error.response?.data?.message || "Erro inesperado";
      console.error(mensagem);
      toast.error(mensagem);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="mt-5 md:mt-5 bg-green-600 p-2 rounded mb-4 text-white font-medium"
      >
        Criar Usuário
      </button>

      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 bg-opacity-20 z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Criar Usuário</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium mb-1"
                >
                  Nome
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium mb-1"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium mb-1"
                >
                  Senha
                </label>
                <input
                  type="password"
                  id="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="role"
                  className="block text-sm font-medium mb-1"
                >
                  Função
                </label>
                <select
                  id="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="EMPLOYEE">Funcionário</option>
                  <option value="COMPANY_ADMIN">
                    Administrador da Empresa
                  </option>
                </select>
              </div>

              <div className="flex justify-end space-x-2 mt-4">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Criar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

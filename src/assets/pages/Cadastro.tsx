import { use, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export function CadastroComp() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    cnpj: "",
    representant: "",
    rep_email: "",
    rep_num: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Atualiza o state conforme digita
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // Envia o formulário
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await axios.post(
        "https://stock-back-vert.vercel.app/companies",
        formData
      );
      setMessage("Empresa cadastrada com sucesso!");
      navigate("/auth");
      setFormData({
        name: "",
        cnpj: "",
        representant: "",
        rep_email: "",
        rep_num: "",
        password: "",
      });
      console.log(res);
    } catch (err) {
      console.error(err);
      setMessage("Erro ao cadastrar empresa.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Cadastro de Empresa
      </h2>

      {message && (
        <p className="mb-4 text-center text-sm font-medium text-red-500">
          {message}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1">
            Nome
          </label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="cnpj" className="block text-sm font-medium mb-1">
            CNPJ
          </label>
          <input
            type="text"
            id="cnpj"
            value={formData.cnpj}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label
            htmlFor="representant"
            className="block text-sm font-medium mb-1"
          >
            Representante
          </label>
          <input
            type="text"
            id="representant"
            value={formData.representant}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="rep_email" className="block text-sm font-medium mb-1">
            Email do Representante
          </label>
          <input
            type="email"
            id="rep_email"
            value={formData.rep_email}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="rep_num" className="block text-sm font-medium mb-1">
            Número do Representante
          </label>
          <input
            type="text"
            id="rep_num"
            value={formData.rep_num}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-1">
            Senha
          </label>
          <input
            type="password"
            id="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700 transition-colors"
        >
          {loading ? "Cadastrando..." : "Cadastrar Empresa"}
        </button>
      </form>
    </div>
  );
}

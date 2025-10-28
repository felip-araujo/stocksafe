import api from "@/services/api/api";
import { useState } from "react";
import toast from "react-hot-toast";
import { Element } from "react-scroll";

export function Contato() {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    mensagem: "",
  });

  const [status, setStatus] = useState<"idle" | "loading">("idle");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    const body = {
      ...formData,
      criadoEm: new Date().toISOString(),
    };

    try {
      const res = await api.post("/contato", body);

      if (res.status === 200 || res.status === 201) {
        toast.success("✅ Sua mensagem foi enviada com sucesso!");
        setFormData({ nome: "", email: "", telefone: "", mensagem: "" });
      } else {
        toast.error("❌ Ocorreu um erro ao enviar sua mensagem.");
      }
    } catch (error) {
      console.error(error);
      toast.error("❌ Erro de conexão. Tente novamente mais tarde.");
    } finally {
      setStatus("idle");
    }
  };

  return (
    <Element name="contato">
      <section id="contato" className="bg-gray-50 py-2 px-6 md:px-12">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          {/* Coluna esquerda: Título + Subtítulo */}
          <div className="flex flex-col justify-center">
            <h2 className="text-4xl font-bold text-gray-800 mb-4 text-center">
              Vamos conversar?
            </h2>
            <p className="text-gray-600 text-lg text-center">
              Preencha o formulário nossa equipe entrará em contato para
              entender suas necessidades e apresentar uma demonstração do nosso
              sistema.
            </p>
            <img src="images/mockup-app.png" alt="Dashboard sistema Stock Seguro" 
            className=""/>
          </div>

          {/* Coluna direita: Formulário */}
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl shadow-lg p-8 space-y-6"
          >
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Nome completo
                </label>
                <input
                  type="text"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  required
                  placeholder="Digite seu nome"
                  className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  E-mail
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="seuemail@gmail.com"
                  className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Telefone
                </label>
                <input
                  type="tel"
                  name="telefone"
                  value={formData.telefone}
                  onChange={handleChange}
                  placeholder="(00) 00000-0000"
                  className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Mensagem
                </label>
                <textarea
                  name="mensagem"
                  value={formData.mensagem}
                  onChange={handleChange}
                  required
                  rows={5}
                  placeholder="Escreva aqui como podemos ajudar..."
                  className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full bg-blue-600 text-white font-bold rounded-xl py-3 hover:bg-blue-700 transition-all duration-300 disabled:opacity-50"
              >
                {status === "loading" ? "Enviando..." : "Enviar mensagem"}
              </button>
            </div>
          </form>
        </div>
      </section>
    </Element>
  );
}

import api from "@/services/api/api";
import { Link as LinkIcon, X } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

export function LinkGenerate() {
  const companyId = localStorage.getItem("companyId");
  const [isOpen, setIsOpen] = useState(false);
  const [inviteLink, setInviteLink] = useState<string | null>(null);

  const genLink = async () => {
    try {
      const response = await api.post(`/invite/generate/`, { companyId });
      const linkGerado = response.data.inviteUrl;
      const message = response.data.message;

      setInviteLink(linkGerado);
      toast.success(message);
      setIsOpen(true);
    } catch (error) {
      toast.error("Erro ao gerar o link.");
      console.error(error);
    }
  };

  const handleCopy = async () => {
    if (inviteLink) {
      await navigator.clipboard.writeText(inviteLink);
      toast.success("Link copiado para a área de transferência!");
    }
  };

  return (
    <>
      {/* ✅ Botão principal com ícone alinhado */}
      <button
        onClick={genLink}
        className="flex items-center gap-2 mt-5 md:mt-5 ml-2 bg-blue-600 p-2 rounded mb-4 text-white font-medium hover:bg-blue-700 transition"
      >
        <LinkIcon className="w-4 h-4" />
        Link de Cadastro
      </button>

      {/* ✅ Modal */}
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg relative">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>

            <h2 className="text-lg font-semibold text-gray-800 mb-3">
              Link de cadastro gerado
            </h2>
            <p className="text-gray-600 mb-4">
              Clique no link abaixo para copiar automaticamente:
            </p>

            <button
              onClick={handleCopy}
              className="block w-full text-center text-blue-600 font-medium border border-blue-500 rounded-lg px-3 py-2 hover:bg-blue-50 transition"
            >
              {inviteLink}
            </button>
          </div>
        </div>
      )}
    </>
  );
}

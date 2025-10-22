import { useNavigate } from "react-router-dom";

export function CancelarAssinatura() {
  const navigate = useNavigate();

  const handleExclude = () => {
    const confirmacao = window.confirm(
      "Realmente desja cancelar sua assinatura ?"
    );

    if (confirmacao) {
      console.log("direcionar a outra pagina");
      navigate("/assinatura/necessaria");
    }
  };

  return (
    <>
      <button
        onClick={handleExclude}
        className="p-2 rounded mt-2 bg-zinc-500 text-white hover:bg-zinc-600 font-medium"
      >
        Cancelar Assinatura
      </button>
    </>
  );
}

import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const SuccessPage = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("confirmando...");
  const companyId = localStorage.getItem("companyId");

  useEffect(() => {
    const confirmSubscription = async () => {
      const sessionId = searchParams.get("session_id");
      if (!sessionId) return setStatus("Sessão inválida");

      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/subscription/${companyId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId }),
        });

        const data = await res.json();

        if (data.status === "active") {
          setStatus("✅ Assinatura confirmada! Acesso liberado.");
        } else {
          setStatus(`⚠️ Status: ${data.status}`);
        }
      } catch (err) {
        console.error("Erro ao confirmar assinatura:", err);
        setStatus("❌ Erro ao confirmar assinatura");
      }
    };

    confirmSubscription();
  }, [searchParams, companyId]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-4">Assinatura</h1>
      <p className="text-lg">{status}</p>
    </div>
  );
};

export default SuccessPage;

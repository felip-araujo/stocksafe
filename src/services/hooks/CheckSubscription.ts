import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export function useRequireSubscription() {
  const navigate = useNavigate();

  useEffect(() => {
    const checkSubscription = async () => {
      try {
        const token = localStorage.getItem("token");
        const companyId = localStorage.getItem("companyId");

        if (!token || !companyId) {
          navigate("/auth");
          return;
        }

        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/subscription/status/${companyId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!res.ok) {
          toast.error("Seu plano está expirado ou cancelado");
          // ⚡ Não limpar localStorage, só redirecionar
          navigate("/assinatura/necessaria");
        } else {
          const data = await res.json();
          // Atualiza status e fim do trial
          localStorage.setItem("status", data.data.status);
          localStorage.setItem("fim_teste", data.data.currentPeriodEnd);
        }
      } catch (err) {
        console.error("Erro ao verificar assinatura:", err);
      }
    };

    checkSubscription();
  }, [navigate]);
}

// hooks/useRequireSubscription.ts
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function useRequireSubscription() {
  const navigate = useNavigate();

  useEffect(() => {
    const checkSubscription = async () => {
      try {
        const token = localStorage.getItem("token"); // se estiver usando JWT
        const companyId = localStorage.getItem("companyId");

        if (!token || !companyId) {
          navigate("/auth");
          return;
        }

        const res = await fetch(`${import.meta.env.VITE_API_URL}/subscription/status/${companyId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          // assinatura inativa ou erro → redireciona
          navigate("/assinatura/necessaria");
          localStorage.clear()
          
        }

        console.log(res)
      } catch (err) {
        console.error("Erro ao verificar assinatura:", err);
        navigate("/assinatura/necessaria");
        localStorage.clear()
      }
    };

    checkSubscription();
  }, [navigate]);
}

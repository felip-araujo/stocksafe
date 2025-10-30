import { useEffect, useState } from "react";
import api from "../api/api";

export function useCheckPlanLevel() {
  const [plan, setPlan] = useState(localStorage.getItem("plano") || "basic");

  useEffect(() => {
    const checkLevel = async () => {
      try {
        const token = localStorage.getItem("token");
        const companyId = localStorage.getItem("companyId");

        if (!token || !companyId) return;

        const res = await api.get(
          `${import.meta.env.VITE_API_URL}/subscription/status/${companyId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const planoAtual = res.data?.data?.plan || "basic";
        localStorage.setItem("plano", planoAtual);
        setPlan(planoAtual);
      } catch (err) {
        console.error("Erro ao verificar assinatura:", err);
        
      }
    };

    checkLevel();
  }, []);

  return plan;
}

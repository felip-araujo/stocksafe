import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

/**
 * Hook para proteger páginas por role
 * @param allowedRoles array de roles que podem acessar a página
 */
export function useAuthGuard(allowedRoles: string[]) {
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem("role");

    // Se não tiver role ou a role não estiver permitida, redireciona
    if (!role || !allowedRoles.includes(role)) {
      navigate("/auth");
    }
  }, [navigate, allowedRoles]);
}



// hooks/useLogout.ts
import { useNavigate } from "react-router-dom";

export function useLogout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/auth"); // redireciona pro login
  };

  return handleLogout;
}

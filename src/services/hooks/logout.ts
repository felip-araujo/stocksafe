// hooks/useLogout.ts
import { useNavigate } from "react-router-dom";

export function useLogout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear()

    navigate("/auth"); // redireciona pro login
  };

  return handleLogout;
}

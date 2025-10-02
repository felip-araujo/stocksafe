import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthGuard } from "@/services/hooks/validator";

export function SuperDash() {
  useAuthGuard(["SUPER_ADMIN"]);
  return (
    <>
      <p>Super Dashboard Page</p>
    </>
  );
}

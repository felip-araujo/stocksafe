import { useAuthGuard } from "@/services/hooks/validator";
import { CompaniesList } from "./Comp";

export function SuperDash() {
  useAuthGuard(["SUPER_ADMIN"]);
  return (
    <>
      <p>Super Dashboard Page</p>
      <CompaniesList></CompaniesList>
    </>
  );
}

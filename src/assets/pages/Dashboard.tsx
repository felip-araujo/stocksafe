import { useAuthGuard } from "@/services/hooks/validator";
import { DashboardCompany } from "../components/company_dash/DashStats";

export function DashPage() {
  useAuthGuard(["COMPANY_ADMIN"]);

  return (
    <>
      <DashboardCompany></DashboardCompany>
    </>
  );
}

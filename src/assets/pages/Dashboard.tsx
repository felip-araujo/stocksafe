import { useAuthGuard } from "@/services/hooks/validator";
import { useRequireSubscription } from "@/services/hooks/CheckSubscription";
import { DashboardCompany } from "../components/company_dash/DashStats";

export function DashPage() {
  useAuthGuard(["COMPANY_ADMIN"]);
  useRequireSubscription()

  return <DashboardCompany />;
}

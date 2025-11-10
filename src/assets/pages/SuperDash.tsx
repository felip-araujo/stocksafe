import { useAuthGuard } from "@/services/hooks/validator";

import { DashboardAnalytics } from "../components/super_dash/SuperAnalyticsDash";


export function SuperDash() {
  useAuthGuard(["SUPER_ADMIN"]);
  return (
    <>
      <DashboardAnalytics />
      
    </>
  );
}

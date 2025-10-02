import { useAuthGuard } from "@/services/hooks/validator";

import { SidebarDash } from "../components/company_dash/SideBarDash";

export function DashPage() {
  useAuthGuard(["COMPANY_ADMIN"]);

  return (
    <>
      <SidebarDash></SidebarDash>
    </>
  );
}

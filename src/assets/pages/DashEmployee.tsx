import { useRequireSubscription } from "@/services/hooks/CheckSubscription";
import { SidebarDash } from "../components/company_dash/SideBarDash";

export function DashEmployee() {
  useRequireSubscription()
  return <SidebarDash></SidebarDash>;
}

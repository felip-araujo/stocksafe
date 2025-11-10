import { useAuthGuard } from "@/services/hooks/validator";
import { SuperSideBar } from "../components/super_dash/SuperSide";




export function SuperDash() {
  useAuthGuard(["SUPER_ADMIN"]);
  return (
    <>
      <SuperSideBar />
      
    </>
  );
}

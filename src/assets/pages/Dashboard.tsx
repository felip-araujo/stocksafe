import { useAuthGuard } from "@/services/hooks/validator";

export function DashPage() {
  useAuthGuard(["COMPANY_ADMIN"]);

  return (
    <>
      <p>Dashboard Page</p>
    </>
  );
}

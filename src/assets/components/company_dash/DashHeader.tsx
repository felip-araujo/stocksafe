import { useLogout } from "@/services/hooks/logout";
import { LogOut, PackagePlus } from "lucide-react";

export function DashHeader() {
  

    const logout = useLogout();

  return (
    <>
      <div className="p-4 flex justify-between items-center">
        {/* Logo + Texto */}
        <div className="flex items-center">
          <div className="p-4 bg-blue-500 rounded-lg flex items-center justify-center">
            <a className="text-white font-bold" href="/">
              <PackagePlus />
            </a>
          </div>
          <a href="/">
            <p className="text-zinc-900 text-2xl font-medium ml-2">StockSafe</p>
          </a>
        </div>

        {/* Botões */}
        <div className="flex items-center">
          <a
            className="text-lm font-normal text-gray-900 p-2.5 rounded-sm"
            onClick={logout}
          >
            <LogOut></LogOut>
          </a>
        </div>
      </div>
    </>
  );
}

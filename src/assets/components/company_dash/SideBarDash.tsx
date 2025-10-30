import {
  Home,
  Package,
  Users,
  Settings,
  LogOut,
  Store,
  NotebookPen,
  Menu,
  X,
  ChevronLeft,
  DollarSign,
  Lock,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useLogout } from "@/services/hooks/logout";
import { useState } from "react";
import { useRequireSubscription } from "@/services/hooks/CheckSubscription";
import { useCheckPlanLevel } from "@/services/hooks/CheckPlanLevel";
import { TrialWarning } from "../signature/TrialWarning";

export function SidebarDash() {
  useRequireSubscription();
  const plan = useCheckPlanLevel();
  const logout = useLogout();

  const status = localStorage.getItem("status")
  const role = localStorage.getItem("role");
  const companyName = localStorage.getItem("companyName");
  const [isOpen, setIsOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const goldFeatures = ["/sales", "/produtos", "/sales/user"];

  let navItems = [
    { to: "/dashboard", label: "Início", icon: <Home size={20} /> },
    { to: "/material", label: "Material Consumo", icon: <Store size={20} /> },
    {
      to: "/requisicao",
      label: "Requisições",
      icon: <NotebookPen size={20} />,
    },
    { to: "/usuarios", label: "Usuários", icon: <Users size={20} /> },
    { to: "/produtos", label: "Produtos Estoque", icon: <Package size={20} /> },
    { to: "/sales", label: "Vendas", icon: <DollarSign size={20} /> },
    { to: "/config", label: "Configurações", icon: <Settings size={20} /> },
  ];

  if (role === "EMPLOYEE") {
    navItems = [
      {
        to: "/user-request",
        label: "Requisições",
        icon: <NotebookPen size={20} />,
      },
      { to: "/material", label: "Material Consumo", icon: <Store size={20} /> },
      {
        to: "/produtos",
        label: "Produtos Estoque",
        icon: <Package size={20} />,
      },
      { to: "/sales/user", label: "Vendas", icon: <DollarSign size={20} /> },
      { to: "/config", label: "Configurações", icon: <Settings size={20} /> },
    ];
  }

  return (
    <>
      {/* 🔹 Faixa superior no mobile */}
      <div className="md:hidden fixed top-0 left-0 w-full z-40 bg-gray-900 text-gray-100 flex items-center justify-between px-4 py-3 shadow-md">
        <span className="font-semibold">{companyName} <TrialWarning /></span>
        
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="p-2 rounded-lg hover:bg-gray-800 transition"
        >
          <Menu size={22} />
        </button>
      </div>

      {/* 🔹 Fundo escuro quando menu mobile aberto */}
      {isMobileMenuOpen && (
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
        />
      )}

      {/* 🔹 Sidebar */}
      <aside
        className={`fixed md:static top-0 left-0 z-50 bg-gray-900 text-gray-100 flex flex-col shadow-lg transition-all duration-300
        ${isOpen ? "w-64" : "w-20"}
        ${
          isMobileMenuOpen
            ? "translate-x-0"
            : "-translate-x-full md:translate-x-0"
        }
        min-h-screen
      `}
      >
        {/* Header interno */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-700">
          {isOpen && <span className="text-lg font-bold">{companyName} 
            { status !== "active" && (<a href="/assinatura/necessaria" className="font-light text-lm"> <br /> <TrialWarning /> </a>  )}
          </span> }
          
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="hidden md:block p-1 rounded-lg hover:bg-gray-800 transition"
            >
              <ChevronLeft
                size={22}
                className={`transition-transform ${
                  !isOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="md:hidden p-1 rounded-lg hover:bg-gray-800 transition"
            >
              <X size={22} />
            </button>
          </div>
        </div>

        {/* Menu principal */}
        <nav className="flex flex-col h-full px-2 py-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const isGoldFeature = goldFeatures.includes(item.to);
            const isDisabled = plan === "basic" && isGoldFeature;

            return (
              <div
                key={item.to}
                className={`relative group flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-colors ${
                  isDisabled
                    ? "opacity-50 cursor-not-allowed"
                    : "cursor-pointer hover:bg-gray-800 hover:text-blue-300"
                }`}
              >
                {isDisabled ? (
                  <>
                    {item.icon}
                    {isOpen && (
                      <span className="text-gray-400 flex items-center gap-1">
                        {item.label}
                        <Lock size={14} className="opacity-70" />
                      </span>
                    )}
                    <div className="fixed left-[calc(100%+8px)] top-1/2 -translate-y-1/2 hidden group-hover:flex bg-gray-800 text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap z-[9999] pointer-events-none">
                      Recurso exclusivo do plano Gold
                    </div>
                  </>
                ) : (
                  <NavLink
                    to={item.to}
                    className={({ isActive }) =>
                      `flex items-center gap-3 w-full py-2 rounded-sm transition-colors ${
                        isActive
                          ? " text-blue-300"
                          : "hover:bg-gray-800 hover:text-blue-300"
                      }`
                    }
                  >
                    {item.icon}
                    {isOpen && <span>{item.label}</span>}
                  </NavLink>
                )}
              </div>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="px-2 py-4 border-t border-gray-700">
          <button
            onClick={logout}
            className="flex items-center gap-3 w-full px-4 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors"
          >
            <LogOut size={20} />
            {isOpen && <span>Sair</span>}
          </button>
        </div>
      </aside>
    </>
  );
}


import {
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  Building2,
  CreditCard,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useLogout } from "@/services/hooks/logout";
import { useState } from "react";

export function SuperSideBar() {
  const logout = useLogout();
  const [isOpen, setIsOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { to: "/", label: "Usuários", icon: <Users size={20} /> },
    { to: "/", label: "Empresas", icon: <Building2 size={20} /> },
    { to: "/", label: "Assinaturas", icon: <CreditCard size={20} /> },
    { to: "/config", label: "Configurações", icon: <Settings size={20} /> },
  ];

  return (
    <>
      {/* 🔹 Topbar (Mobile) */}
      <div className="md:hidden fixed top-0 left-0 w-full z-40 bg-zinc-950 text-gray-100 flex items-center justify-between px-4 py-3 shadow-md">
        <span className="font-semibold text-lg">Painel Admin</span>
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
        className={`fixed md:static top-0 left-0 z-50 bg-zinc-950 text-gray-100 flex flex-col shadow-lg transition-all duration-300
        ${isOpen ? "w-64" : "w-20"}
        ${
          isMobileMenuOpen
            ? "translate-x-0"
            : "-translate-x-full md:translate-x-0"
        }
        min-h-screen
      `}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-700">
          {isOpen && <span className="text-lg font-bold">Painel Admin</span>}

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="hidden md:block p-1 rounded-lg hover:bg-gray-800 transition"
            >
              <ChevronLeft
                size={22}
                className={`transition-transform ${!isOpen ? "rotate-180" : ""}`}
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

        {/* Navegação */}
        <nav className="flex flex-col h-full px-2 py-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-colors ${
                  isActive
                    ? "bg-gray-800 text-blue-300"
                    : "hover:bg-gray-800 hover:text-blue-300"
                }`
              }
            >
              {item.icon}
              {isOpen && <span>{item.label}</span>}
            </NavLink>
          ))}
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

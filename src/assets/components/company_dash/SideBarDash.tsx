import {
  Home,
  Package,
  Users,
  Settings,
  LogOut,
  Store,
  NotebookPen,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useLogout } from "@/services/hooks/logout";

export function SidebarDash() {
  const logout = useLogout();
  const role = localStorage.getItem("role");
  const companyName = localStorage.getItem("companyName");
  

  let navItems = [
    { to: "/dashboard", label: "Início", icon: <Home size={20} /> },
    { to: "/produtos", label: "Produtos", icon: <Package size={20} /> },
    { to: "/material", label: "Materiais", icon: <Store size={20} /> },
    {
      to: "/requisicao",
      label: "Requisições",
      icon: <NotebookPen size={20} />,
    },
    { to: "/usuarios", label: "Usuários", icon: <Users size={20} /> },
    { to: "/config", label: "Configurações", icon: <Settings size={20} /> },
  ];

  if (role === "EMPLOYEE") {
    navItems = [
      { to: "/dash-employee", label: "Início", icon: <Home size={20} /> },
      { to: "/material", label: "Material", icon: <Store size={20} /> },
      { to: "/config", label: "Configurações", icon: <Settings size={20} /> },
    ];
  }

  return (
    <aside className="h-screen w-64 bg-gray-900 text-gray-100 flex flex-col shadow-lg">
      {/* Logo / Título */}
      <div className="px-6 py-4 text-xl font-bold border-b border-gray-700">
        {companyName}
      </div>
    

      {/* Menu */}
      <nav className="flex flex-col h-full px-2 py-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-colors 
        ${item.to === "/config" ? "mt-auto" : ""} 
        ${
          isActive
            ? "bg-gray-800 text-blue-400"
            : "hover:bg-gray-800 hover:text-blue-300"
        }`
            }
          >
            {item.icon}
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Botão de logout */}
      <div className="px-2 py-4 border-t border-gray-700">
        <button
          onClick={logout}
          className="flex items-center gap-3 w-full px-4 py-2 rounded-lg font-medium  hover:text-gray-600 transition-colors"
        >
          <LogOut size={20} />
          Sair
        </button>
      </div>
    </aside>
  );
}

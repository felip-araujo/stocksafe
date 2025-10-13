import { useState } from "react";
import { PackagePlus, Menu, X } from "lucide-react";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="p-4 flex justify-between items-center border-b border-gray-200 relative">
      {/* Logo + Texto */}
      <div className="flex items-center">
        <a href="/" className="flex items-center">
          <div className="p-3 bg-blue-500 rounded-lg flex items-center justify-center">
            <PackagePlus className="text-white" />
          </div>
          <p className="text-zinc-900 text-xl font-semibold ml-2">StockSafe</p>
        </a>
      </div>

      {/* Menu Desktop */}
      <div className="hidden md:flex items-center">
        <a
          className="text-base font-normal text-zinc-900 px-3 py-2 rounded-sm mr-2 hover:bg-blue-500 hover:text-white transition-all"
          href="/auth"
        >
          Entrar
        </a>
        <a
          className="text-base font-normal bg-blue-500 text-white px-3 py-2 rounded-sm hover:bg-blue-600 transition-all"
          href="/cadastro"
        >
          Teste Grátis
        </a>
      </div>

      {/* Botão Menu Mobile */}
      <button
        className="md:hidden p-2 rounded hover:bg-gray-100"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Menu Mobile Dropdown */}
      {menuOpen && (
        <div className="absolute top-full left-0 w-full bg-white border-t border-gray-200 shadow-md flex flex-col items-center py-4 md:hidden z-50">
          <a
            href="/auth"
            className="w-11/12 text-center py-2 text-zinc-800 rounded hover:bg-blue-500 hover:text-white transition mb-2"
            onClick={() => setMenuOpen(false)}
          >
            Entrar
          </a>
          <a
            href="/cadastro"
            className="w-11/12 text-center py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            onClick={() => setMenuOpen(false)}
          >
            Teste Grátis
          </a>
        </div>
      )}
    </header>
  );
}

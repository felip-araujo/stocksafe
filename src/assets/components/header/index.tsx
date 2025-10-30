import { useState } from "react";
import { Menu, X } from "lucide-react";
import { LogoNome } from "../logo/Logo&Nome";
import { Link } from "react-scroll";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="p-4 flex ml-10 mr-10 justify-between items-center border-b border-gray-200 relative">
      {/* Logo + Texto */}
      <LogoNome />

      {/* Menu Desktop */}
      <div className="hidden md:flex items-center">
        <nav>
          <Link
            to="contato"
            smooth={true}
            duration={500}
            className="text-base mr-2 font-normal text-zinc-900 hover:text-blue-800 transition-all ease-in-out cursor-pointer"
          >
            Contato
          </Link>
          <Link
            to="plans"
            smooth={true}
            duration={500}
            className="text-base font-normal text-zinc-900 hover:text-blue-800 transition-all ease-in-out cursor-pointer"
          >
            Planos
          </Link>
        </nav>

        <a
          className="text-base font-normal text-zinc-900 px-3 py-2 mr-2 hover: hover:text-blue-800 transition-all ease-in-out"
          href="/auth"
        >
          Entrar
        </a>

        <Link
          to="plans"
          smooth={true}
          duration={500}
          className="text-base font-normal bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 transition-all"
        >
          Teste Grátis
        </Link>
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

          <Link
            to="plans"
            smooth={true}
            duration={500}
            className="mt-2 w-11/12 text-center py-2 text-zinc-800 rounded hover:bg-blue-500 hover:text-white transition mb-2"
          >
            Planos
          </Link>
          <Link
            to="contato"
            smooth={true}
            duration={500}
            className="w-11/12 text-center py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            Demonstração
          </Link>
        </div>
      )}
    </header>
  );
}

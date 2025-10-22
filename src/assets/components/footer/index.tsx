import { LogoNome } from "../logo/Logo&Nome";

export function Footer() {
  return (
    <footer className="bg-zinc-100 text-zinc-800 py-6 px-4 mt-10 border-t border-zinc-200">
      <div className="max-w-6xl mx-auto flex flex-col items-center text-center sm:flex-row sm:justify-between sm:text-left">
        {/* Logo + Nome */}
        <LogoNome />

        {/* Links rápidos */}
        <div className="flex flex-wrap justify-center gap-4 text-sm mb-4 sm:mb-0">
          <a
            href="/sobre"
            className="hover:text-blue-500 transition-colors duration-200"
          >
            Sobre
          </a>
          <a
            href="/contato"
            className="hover:text-blue-500 transition-colors duration-200"
          >
            Contato
          </a>
          <a
            href="/politica"
            className="hover:text-blue-500 transition-colors duration-200"
          >
            Política de Privacidade
          </a>
          <a
            href="/termos-de-uso"
            className="hover:text-blue-500 transition-colors duration-200"
          >
            Termos de Uso
          </a>
        </div>

        {/* Direitos autorais */}
        <div className="text-xs text-zinc-500 mt-2 sm:mt-0">
          © {new Date().getFullYear()} StockSafe — Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
}

import { PackagePlus } from "lucide-react";

export function Header() {
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
          <a href="/"><p className="text-zinc-900 text-2xl font-medium ml-2">StockSafe</p></a>
          
        </div>

        {/* Botões */}
        <div className="flex items-center">
          <a
            className="text-lm font-normal text-zinc-900 p-2.5 rounded-sm mr-2 hover:bg-blue-500 hover:text-white hover:transition-all duration-200 ease-in-out"
            href="/auth"
          >
            Entrar
          </a>
          <a
            className="text-lm font-normal bg-blue-500 text-white p-2.5 rounded-sm"
            href="/cadastro"
          >
            Teste Grátis
          </a>
        </div>
      </div>
    </>
  );
}

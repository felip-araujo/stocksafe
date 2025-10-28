import { PackagePlus } from "lucide-react";

export function LogoNomeBranco() {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-center mb-2">
      {/* Ícone */}
      <div className="p-2 sm:p-3 bg-blue-500 rounded-lg flex items-center justify-center mb-2 sm:mb-0 sm:mr-3 transition-transform duration-300 hover:scale-105">
        <a href="/" className="text-white font-bold">
          <PackagePlus className="w-5 h-5 sm:w-6 sm:h-6" />
        </a>
      </div>

      {/* Texto */}
      <a href="/" className="text-center sm:text-left">
        <p className="text-white text-base sm:text-lg font-ligth tracking-tight">
          StockSeguro
        </p>
      </a>
    </div>
  );
}


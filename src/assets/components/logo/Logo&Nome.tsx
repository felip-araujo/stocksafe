import { PackagePlus } from "lucide-react";

export function LogoNome() {
  return (
    <>
      <div className="flex flex-col sm:flex-row items-center justify-center mb-2">
        <div className="p-3 bg-blue-500 rounded-lg flex items-center justify-center mb-3 sm:mb-0 sm:mr-3">
          <a href="/" className="text-white font-bold">
            <PackagePlus />
          </a>
        </div>
        <a href="/" className="text-center sm:text-left">
          <p className="text-zinc-900 text-2xl font-semibold">StockSafe</p>
        </a>
      </div>
    </>
  );
}

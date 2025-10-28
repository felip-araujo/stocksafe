import { useEffect, useState } from "react";
import { CheckCircle } from "lucide-react";

export function ComparacaoExcel() {
  const imagens = [
    "/images/app-tela1.png",
    "/images/app-tela2.png",
    "/images/app-tela3.png",
    "/images/dashboard.png",
  ];

  const [current, setCurrent] = useState(0);

  // alterna as imagens automaticamente a cada 3 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % imagens.length);
    }, 3000); // muda a cada 3 segundos
    return () => clearInterval(interval);
  }, [imagens.length]);

  return (
    <section className="bg-blue-900 py-20 px-6 md:px-12 overflow-hidden">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        {/* Lado Esquerdo – Texto Comparativo */}
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-100 mb-6">
            Por que é melhor que o Excel?
          </h2>

          <p className="text-gray-100 mb-8 text-lg leading-relaxed">
            O Excel até quebra um galho — mas foi feito pra planilhas, não pra gestão.
            Nosso sistema foi criado para automatizar tarefas, reduzir erros e dar
            uma visão completa do seu negócio em tempo real.
          </p>

          <ul className="space-y-4">
            <li className="flex items-start">
              <CheckCircle className="text-green-400 w-6 h-6 mr-3" />
              <p className="text-gray-100">
                Atualização automática dos dados, sem fórmulas quebradas.
              </p>
            </li>
            <li className="flex items-start">
              <CheckCircle className="text-green-400 w-6 h-6 mr-3" />
              <p className="text-gray-100">
                Interface moderna e intuitiva — sem precisar ser “bom em Excel”.
              </p>
            </li>
            <li className="flex items-start">
              <CheckCircle className="text-green-400 w-6 h-6 mr-3" />
              <p className="text-gray-100">
                Tudo salvo na nuvem e acessível de qualquer dispositivo.
              </p>
            </li>
          </ul>
        </div>

        {/* Lado Direito – Carrossel Automático */}
        <div className="relative w-full h-64 md:h-80 flex items-center justify-center">
          {imagens.map((src, index) => (
            <img
              key={index}
              src={src}
              alt={`Tela ${index + 1}`}
              className={`absolute rounded-2xl shadow-xl w-auto max-w-full h-full object-cover transition-opacity duration-700 ${
                index === current ? "opacity-100 z-10" : "opacity-0 z-0"
              }`}
            />
          ))}

          {/* Indicadores de navegação (bolinhas) */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex space-x-2">
            {imagens.map((_, index) => (
              <span
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === current ? "bg-white scale-110" : "bg-white/40"
                }`}
              ></span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

import {
  ArrowRight,
  UserPlus,
  Package,
  ClipboardList,
  BarChart3,
  CheckCircle,
} from "lucide-react";

import { Element } from "react-scroll";

export function ComoFunciona() {
  const steps = [
    {
      icon: <UserPlus size={32} />,
      title: "Crie sua conta",
      description:
        "Cadastre sua empresa e tenha acesso imediato ao painel completo.",
    },
    {
      icon: <Package size={32} />,
      title: "Cadastre seus materiais",
      description:
        "Organize todos os seus produtos e insumos de forma simples e rápida.",
    },
    {
      icon: <ClipboardList size={32} />,
      title: "Controle seu estoque",
      description:
        "Saiba o que entra e o que sai, evitando perdas e desperdícios.",
    },
    {
      icon: <BarChart3 size={32} />,
      title: "Acompanhe o desempenho",
      description:
        "Visualize relatórios automáticos e descubra o que realmente dá lucro.",
    },
    {
      icon: <CheckCircle size={32} />,
      title: "Simplifique sua gestão",
      description:
        "Com o Stock Seguro, tudo fica mais fácil, rápido e sob controle.",
    },
  ];

  return (
    <Element name="como">
      <section className="w-full bg-blue-700 text-zinc-200 py-16 px-6">
        <div className="container mx-auto text-center max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Como o <span className="text-white">Stock Seguro</span> funciona?
          </h2>
          <p className="text-lg text-blue-100 mb-12 max-w-5xl mx-auto">
            Veja como é simples transformar o controle do seu estoque em um
            processo inteligente, automatizado e sem complicações. Cadastre seus
            produtos, registre entradas e saídas, acompanhe vendas e tenha uma
            visão clara de tudo o que acontece — em tempo real e de forma
            totalmente integrada.
          </p>

          <div className="flex flex-col md:flex-row justify-between items-center gap-10 relative">
            {steps.map((step, index) => (
              <div
                key={index}
                className="flex flex-col items-center text-center relative w-full md:w-1/5"
              >
                <div className="bg-blue-500 p-4 rounded-full shadow-lg mb-4">
                  {step.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-blue-100 text-sm md:text-base leading-relaxed">
                  {step.description}
                </p>

                {/* Linha de conexão (aparece apenas em telas médias ou maiores) */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute right-[-40px] top-10">
                    <ArrowRight size={32} className="text-blue-300" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </Element>
  );
}

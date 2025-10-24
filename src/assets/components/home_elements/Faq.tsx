import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface Pergunta {
  pergunta: string;
  resposta: string;
}

export function FAQ() {
  const perguntas: Pergunta[] = [
    {
      pergunta: "O que torna o sistema melhor do que planilhas ou Excel?",
      resposta:
        "Nosso sistema foi feito para automatizar processos e evitar erros manuais. Tudo é atualizado em tempo real, sem fórmulas quebradas, com relatórios prontos e visual intuitivo — ideal para quem quer praticidade e controle de verdade.",
    },
    {
      pergunta: "Preciso instalar algo no meu computador?",
      resposta:
        "Não. O sistema funciona 100% online. Você só precisa de acesso à internet — pode usar pelo computador, tablet ou celular, de qualquer lugar.",
    },
    {
      pergunta: "Posso cadastrar quantos produtos quiser?",
      resposta:
        "Sim. O sistema não limita a quantidade de produtos ou registros. Você pode organizar todo o seu estoque sem se preocupar com espaço ou lentidão.",
    },
    {
      pergunta: "Como funciona o suporte caso eu precise de ajuda?",
      resposta:
        "Nosso time oferece suporte direto via chat ou e-mail. Além disso, temos tutoriais e vídeos explicativos pra te ajudar em qualquer etapa.",
    },
    {
      pergunta: "Meu histórico de vendas e estoque fica salvo com segurança?",
      resposta:
        "Sim! Todos os dados são armazenados na nuvem com criptografia e backup automático. Você nunca perde informações, mesmo que troque de dispositivo.",
    },
  ];

  const [ativo, setAtivo] = useState<number | null>(null);

  const toggle = (index: number) => {
    setAtivo(ativo === index ? null : index);
  };

  return (
    <section className="bg-gray-50 py-20 px-6 md:px-12">
      <div className="max-w-4xl mx-auto text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
          Perguntas Frequentes
        </h2>
        <p className="text-gray-600 mt-3">
          Tire suas dúvidas sobre como o sistema funciona e descubra como ele pode facilitar sua rotina.
        </p>
      </div>

      <div className="max-w-3xl mx-auto space-y-4">
        {perguntas.map((item: Pergunta, index: number) => (
          <div
            key={index}
            className="bg-white shadow-sm rounded-xl border border-gray-100"
          >
            <button
              onClick={() => toggle(index)}
              className="w-full flex justify-between items-center text-left p-5"
            >
              <span className="font-medium text-gray-800 text-lg">
                {item.pergunta}
              </span>
              <ChevronDown
                className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${
                  ativo === index ? "rotate-180" : ""
                }`}
              />
            </button>

            {ativo === index && (
              <div className="px-5 pb-5 text-gray-600 border-t border-gray-100">
                {item.resposta}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

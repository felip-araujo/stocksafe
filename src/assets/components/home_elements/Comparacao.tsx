export function ComparacaoExcel() {
  return (
    <section className="bg-blue-900 py-20 px-6 md:px-12">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        {/* Lado Esquerdo – Texto Comparativo */}
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-100 mb-6">
            Por que é melhor que o Excel?
          </h2>
          <p className="text-gray-100 mb-8 text-lg">
            O Excel até quebra um galho — mas foi feito pra planilhas, não pra gestão.
            Nosso sistema foi criado para automatizar tarefas, reduzir erros e dar
            uma visão completa do seu negócio em tempo real.
          </p>

          <ul className="space-y-4">
            <li className="flex items-start">
              <span className="bg-green-100 text-green-600 font-bold rounded-full w-6 h-6 flex items-center justify-center mr-3">
                ✓
              </span>
              <p className="text-gray-100">
                Atualização automática dos dados, sem fórmulas quebradas.
              </p>
            </li>
            <li className="flex items-start">
              <span className="bg-green-100 text-green-600 font-bold rounded-full w-6 h-6 flex items-center justify-center mr-3">
                ✓
              </span>
              <p className="text-gray-100">
                Interface moderna e intuitiva — sem precisar ser “bom em Excel”.
              </p>
            </li>
            <li className="flex items-start">
              <span className="bg-green-100 text-green-600 font-bold rounded-full w-6 h-6 flex items-center justify-center mr-3">
                ✓
              </span>
              <p className="text-gray-100">
                Tudo salvo na nuvem e acessível de qualquer dispositivo.
              </p>
            </li>
          </ul>
        </div>

        {/* Lado Direito – Screenshots do Sistema */}
        <div className="relative grid grid-cols-2 gap-4">
          <img
            src="/images/app-tela1.png"
            alt="Tela do sistema 1"
            className="rounded-2xl shadow-lg border border-gray-100"
          />
          <img
            src="/images/app-tela2.png"
            alt="Tela do sistema 2"
            className="rounded-2xl shadow-lg border border-gray-100"
          />
          <img
            src="/images/app-tela3.png"
            alt="Tela do sistema 3"
            className="rounded-2xl shadow-lg border border-gray-100 col-span-2"
          />
        </div>
      </div>
    </section>
  );
}

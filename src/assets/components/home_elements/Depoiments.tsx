export function Depoimentos() {
  const depoimentos = [
    {
      nome: "Mariana Lopes",
      cargo: "Empresária no ramo de Jóias",
      texto:
        "A experiência foi incrível! O sistema é prático e realmente facilitou o controle do meu negócio. Atendimento impecável!",
      foto: "/images/mariana.jpg", // substitua pela sua imagem
    },
    {
      nome: "Carlos Henrique",
      cargo: "Líder de Almoxarifado",
      texto:
        "Achei sensacional a facilidade de uso e a qualidade do resultado final. Estão de parabéns pelo serviço! 👏",
      foto: "/images/homem-almoxarifado.jpg",
    },
    {
      nome: "Juliana Ferreira",
      cargo: "Gerente de Loja",
      texto:
        "Em poucos dias já senti diferença na organização. Tudo ficou muito mais ágil e visualmente bonito!",
      foto: "/images/juliana.jpg",
    },
  ];

  return (
    <section className="bg-blue-600 py-16 px-6 md:px-12">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-5 text-gray-200">
          O que dizem nossos clientes
        </h2>
        <p className="text-lg text-blue-100 mb-10 max-w-5xl mx-auto">
          Confie em quem já testou e aprovou nosso sistema. Nossa prioridade é
          manter cada cliente satisfeito, entregando uma experiência simples,
          eficiente e confiável na gestão do seu negócio.
        </p>

        <div className="grid md:grid-cols-3 gap-8">
          {depoimentos.map((dep, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 flex flex-col items-center text-center"
            >
              <img
                src={dep.foto}
                alt={dep.nome}
                className="w-20 h-20 rounded-full object-cover mb-4 border-4 border-blue-100"
              />
              <p className="text-gray-700 italic mb-4">“{dep.texto}”</p>
              <h3 className="text-lg font-semibold text-gray-900">
                {dep.nome}
              </h3>
              <p className="text-sm text-gray-500">{dep.cargo}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

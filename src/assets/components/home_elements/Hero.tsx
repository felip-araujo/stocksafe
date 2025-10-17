export function Hero() {
  return (
    <section className="w-full bg-white py-12 md:py-24">
      <div className="container mx-auto px-4">
        <div className="flex flex-col-reverse md:flex-row items-center gap-8">
          {/* Lado esquerdo - Imagem */}
          <div className="w-full md:w-1/2 flex justify-center">
            <div className="relative w-full max-w-lg">
              <img
                src="src\assets\images\dashboard.png" // Altere para o caminho da sua imagem
                alt="Aplicação em destaque"
                className="w-full h-auto rounded-xl shadow-2xl"
              />
            </div>
          </div>

          {/* Lado direito - Texto */}
          <div className="w-full md:w-1/2 text-center md:text-left space-y-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium text-gray-900 leading-tight">
              Simplifique sua 
              <span className="text-blue-500 block">gestão de estoque</span>
              hoje mesmo
            </h1>
            <p className="text-lg text-gray-600 max-w-md mx-auto md:mx-0">
              A ferramenta completa para gerenciar seus projetos e aumentar sua 
              eficiência no dia a dia
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <a
                href="/cadastro"
                className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-all text-center font-medium"
              >
                Começar Agora
              </a>
              <a
                href="/sobre"
                className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-all text-center font-medium"
              >
                Saiba Mais
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
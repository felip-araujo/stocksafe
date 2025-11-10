import { useState } from "react";
import { Link } from "react-scroll";
import { Play } from "lucide-react";

export function Hero() {
  const [showVideo, setShowVideo] = useState(false);

  return (
    <section className="w-full bg-gradient-to-b from-white to-gray-50 py-16 md:py-10 relative">
      <div className="container mx-auto px-4">
        <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-10">
          {/* Imagem com botão de play */}
          <div className="w-full md:w-1/2 flex justify-center md:justify-end relative">
            <div
              className="relative group cursor-pointer"
              onClick={() => setShowVideo(true)}
            >
              <img
                src="/images/mockup-app.jpg"
                alt="Mulher segurando o aplicativo Stock Seguro"
                className="w-full max-w-md md:max-w-lg rounded-2xl shadow-2xl transition-transform duration-700 group-hover:scale-105"
              />

              {/* Botão Play central */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 bg-white/70 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg transition-all group-hover:scale-110">
                  <Play className="w-10 h-10 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-blue-500/20 rounded-full blur-2xl"></div>
          </div>

          {/* Texto */}
          <div className="w-full md:w-1/2 text-center md:text-left space-y-6">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-medium text-gray-900 leading-none">
              Controle total.
              <span className="text-blue-600 block mt-1">
                Zero dor de cabeça.
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-600 max-w-md mx-auto md:mx-0 leading-relaxed">
              Transforme o caos do seu estoque em{" "}
              <span className="font-semibold text-gray-800">
                lucro e tranquilidade
              </span>
              . O <strong>Stock Seguro</strong> te mostra o que entra, o que sai
              e o que realmente dá retorno — tudo na palma da mão.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start pt-2">
              <Link
                to="plans"
                smooth={true}
                duration={500}
                className="bg-blue-600 text-white px-6 py-4 rounded-xl shadow-lg hover:bg-blue-700 transition-all font-semibold text-lg cursor-pointer"
              >
                Começar Agora
              </Link>

              <Link
                to="como"
                smooth={true}
                duration={500}
                className="border border-gray-300 text-gray-700 px-6 py-4 rounded-xl hover:bg-gray-100 transition-all font-medium text-lg cursor-pointer"
              >
                Ver como funciona
              </Link>
            </div>

            <p className="text-sm text-gray-500 mt-4">
              Solicite uma Demonstração. Teste e sinta a diferença em poucos
              minutos.
            </p>
          </div>
        </div>
      </div>

      {/* Modal do vídeo */}
      {showVideo && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="relative w-full max-w-3xl aspect-video bg-black rounded-2xl shadow-2xl overflow-hidden">
            <button
              onClick={() => setShowVideo(false)}
              className="absolute top-3 right-3 bg-white/80 hover:bg-white text-black rounded-full px-3 py-1 text-sm font-medium z-10"
            >
              Fechar ✕
            </button>

            {/* Embed do vídeo */}
            <iframe
              className="w-full h-full rounded-2xl"
              src="https://www.youtube.com/embed/599UrcoG0H8?si=cxqT1wyX6HIILm0S"
              title="Apresentação Stock Seguro"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}
    </section>
  );
}

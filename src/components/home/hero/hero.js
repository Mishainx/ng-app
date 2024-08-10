import Link from "next/link";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="bg-black w-full text-white">
      <div className="w-full flex flex-col sm:flex-row-reverse items-center justify-center">
        {/* Contenedor de la imagen */}
        <div className="relative w-full max-w-[750px]">
          {/* Capa de sombra interna */}
          <div className="absolute inset-0 rounded-xl shadow-hero pointer-events-none" />
          <Image
            src="/banner-2.png"
            alt="Banner Hero Section"
            layout="responsive"
            width={750}
            height={750}
            className="w-full h-auto object-cover rounded-xl"
          />
        </div>

        {/* Contenedor CTA */}
        <div className="flex flex-col items-center text-center p-6 md:p-8 lg:p-12">
          <h1 className="text-3xl font-bold sm:text-4xl md:text-5xl xl:text-6xl mb-4 text-white">
            Nippon Game
          </h1>
          <p className="text-lg md:text-xl mb-6 text-white">
            Expertos en videojuegos
          </p>
          <Link
            href="/catalogo"
            className="inline-flex items-center justify-center h-12 px-6 text-sm font-medium text-white bg-red-500 rounded-xl shadow-lg transition-colors duration-300 ease-in-out hover:bg-red-700"
          >
            Ver productos
          </Link>
        </div>
      </div>
    </section>
  );
}

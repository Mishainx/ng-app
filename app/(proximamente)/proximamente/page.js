"use client"
import { useState } from "react";
import Image from "next/image";
import WhatsappIcon from "@/icons/WhatsappIcon";
import MailIcon from "@/icons/MailIcon";
import Link from "next/link";
import MapsIcon from "@/icons/MapsIcon";

export default function Proximamente() {
  // Estado para controlar si la imagen del logo está cargada
  const [isLogoLoaded, setIsLogoLoaded] = useState(false);

  // Función para actualizar el estado cuando el logo se carga
  const handleLogoLoad = () => {
    setIsLogoLoaded(true);
  };

  return (
    <div className="h-screen bg-[#00091B] text-white flex flex-col items-center justify-center px-2 min-h-screen">
      {/* Capa de luz centrada detrás de los elementos */}
      <div className="absolute inset-0 bg-gradient-radial from-[#FF3B3F] via-[#00091B] to-transparent opacity-60"></div>

      {/* Título */}
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight mb-8 z-10">
        Próximamente<span className="text-red-500">.</span>
      </h1>

      {/* Contenedor de imágenes Sonic y Mario */}
      <div className="flex flex-col lg:flex-row items-center justify-center lg:gap-16 gap-8 z-10">
        {/* Sonic */}
        <div className="hidden lg:block w-32 drop-shadow-2xl transition-opacity duration-1000">
          <Image
            src="/proximamente/sonic-nippongame.png"
            alt="Sonic Nippon Game"
            width={120}
            height={120}
            className="object-contain"
            priority // Carga prioritaria
          />
        </div>

        {/* Logo centrado */}
        <div className="w-full lg:w-2/3 flex justify-center lg:justify-between items-center">
          <Image
            src="/proximamente/nippon-game-logo.png"
            alt="Logo Nippon Game"
            width={400}
            height={240}
            className="object-contain"
            onLoad={handleLogoLoad} // Usando onLoad en vez de onLoadingComplete
          />
        </div>

        {/* Mario */}
        <div className="w-32 drop-shadow-2xl transition-opacity duration-1000">
          <Image
            src="/proximamente/mario-nippongame.png"
            alt="Mario Nippon Game"
            width={120}
            height={120}
            className="object-contain"
            priority // Carga prioritaria
          />
        </div>
      </div>

      {/* Subtítulo */}
      <p className="text-sm font-bold sm:text-base md:text-lg mt-8 mb-4 z-10 text-center">
        Estamos trabajando para traerte algo increíble.
      </p>

      {/* Mensaje de contacto */}
      <p className="text-sm font-bold sm:text-base md:text-lg mb-8 z-10 text-center">
        Mientras tanto, contáctanos en:
      </p>

      {/* Iconos de contacto (Con fadeIn solo después de que el logo se haya cargado) */}
      <div
        className={`flex justify-center space-x-4 mb-8 z-10 transition-all duration-1000 ${
          isLogoLoaded ? "animate-fadeInLong" : "opacity-0"
        }`}
      >
        <div
          className="cursor-pointer p-3 text-white rounded-full bg-red-500/90 hover:bg-red-800 transition duration-200 ease-in-out flex items-center justify-center hover:shadow-xl hover:scale-105"
        >
          <Link href="https://maps.app.goo.gl/cCr4VrpNMuDqTppJA">
            <MapsIcon className="w-6 h-6" />
          </Link>
        </div>
        <div
          className="cursor-pointer p-3 text-white rounded-full bg-red-500/90 hover:bg-red-800 transition duration-200 ease-in-out flex items-center justify-center hover:shadow-xl hover:scale-105"
        >
          <Link href="mailto:nippongame@gmail.com">
            <MailIcon className="w-6 h-6" />
          </Link>
        </div>
        <div
          className="cursor-pointer p-3 text-white rounded-full bg-red-500/90 hover:bg-red-800 transition duration-200 ease-in-out flex items-center justify-center hover:shadow-xl hover:scale-105"
        >
          <Link href="https://wa.me/5491154041650?text=Hola%20Nippon%20Game.%20Quiero%20realizar%20una%20consulta!">
            <WhatsappIcon className="w-6 h-6" />
          </Link>
        </div>
      </div>
    </div>
  );
}

import Image from 'next/image';
import WhatsappIcon from '@/icons/WhatsappIcon';
import MailIcon from '@/icons/MailIcon';
import Link from 'next/link';
import MapsIcon from '@/icons/MapsIcon';

export default function Proximamente() {
  return (
    <div className="h-screen bg-[#00091B] text-white flex flex-col items-center justify-center px-2">
      {/* Capa de luz centrada detrás de los elementos */}
      <div className="absolute inset-0 bg-gradient-radial from-[#FF3B3F] via-[#00091B] to-transparent opacity-60"></div>
        
      {/* Título */}
      <h1 className="text-3xl sm:text-4xl md:text-4xl font-bold leading-tight mb-4 z-10">
        Próximamente<span className="text-red-500">.</span>
      </h1>

      {/* Contenedor de imágenes Sonic y Mario */}
      <div className="flex flex-col lg:flex-row justify-center gap-12 items-center z-10">
        {/* Sonic */}
        <div className="hidden lg:block w-1/8 drop-shadow-2xl">
          <Image
            src="/proximamente/sonic-nippongame.png"
            alt="Sonic Nippon Game"
            width={120}
            height={120}
            className="object-contain"
          />
        </div>

        {/* Logo centrado */}
        <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/2 mx-auto flex justify-center">
          <Image
            src="/proximamente/nippon-game-logo.png"
            alt="Logo Nippon Game"
            width={500}
            height={300}
            className="object-contain"
          />
        </div>

        {/* Mario */}
        <div className="hidden lg:block drop-shadow-2xl">
          <Image
            src="/proximamente/mario-nippongame.png"
            alt="Mario Nippon Game"
            width={200}
            height={200}
            className="object-contain"
          />
        </div>
      </div>

      {/* Subtítulo */}
      <p className="text-sm font-bold sm:text-base md:text-lg mb-6 z-10">
        Estamos trabajando para traerte algo increíble.
      </p>

      {/* Mensaje de contacto */}
      <p className="text-sm font-bold sm:text-base md:text-lg mb-6 z-10">
        Mientras tanto, contáctanos en:
      </p>

      {/* Iconos de contacto */}
      <div className="flex justify-center space-x-6 mb-6 z-10">
        <div className="cursor-pointer p-4 text-white rounded-full bg-red-500/90 hover:bg-red-800 transition duration-200 ease-in-out flex items-center justify-center hover:shadow-xl hover:scale-105">
          <Link href="https://maps.app.goo.gl/cCr4VrpNMuDqTppJA">
            <MapsIcon className="w-8 h-8" />
          </Link>
        </div>
        <div className="cursor-pointer p-4 text-white rounded-full bg-red-500/90 hover:bg-red-800 transition duration-200 ease-in-out flex items-center justify-center hover:shadow-xl hover:scale-105">
          <Link href="mailto:nippongame@gmail.com">
            <MailIcon className="w-8 h-8" />
          </Link>
        </div>
        <div className="cursor-pointer p-4 text-white rounded-full bg-red-500/90 hover:bg-red-800 transition duration-200 ease-in-out flex items-center justify-center hover:shadow-xl hover:scale-105">
          <Link href="https://wa.me/5491154041650?text=Hola%20Nippon%20Game.%20Quiero%20realizar%20una%20consulta!">
            <WhatsappIcon className="w-8 h-8" />
          </Link>
        </div>
      </div>
    </div>
  );
}

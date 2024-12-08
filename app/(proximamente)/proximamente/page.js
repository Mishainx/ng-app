import Image from 'next/image';
import WhatsappIcon from '@/icons/WhatsappIcon';
import MailIcon from '@/icons/MailIcon';
import Link from 'next/link';
import MapsIcon from '@/icons/MapsIcon';

export default function Proximamente() {
  return (
    <div className="h-screen bg-[#00091B] text-white flex flex-col items-center justify-center px-2 relative">
      {/* Capa de luz centrada detrás de los elementos */}
      <div className="absolute inset-0 bg-gradient-radial from-[#FF3B3F] via-[#00091B] to-transparent opacity-60"></div>
        
      {/* Título */}
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight mb-6 z-10 text-center">
        Próximamente<span className="text-red-500">.</span>
      </h1>

      {/* Contenedor principal */}
      <div className="flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-10 z-10">
        {/* Sonic */}
        <div className="hidden lg:block">
          <Image
            src="/proximamente/sonic-nippongame.png"
            alt="Sonic Nippon Game"
            width={100} 
            height={100}
            className="object-contain drop-shadow-lg"
          />
        </div>

        {/* Logo centrado */}
        <div className="flex-shrink-0">
          <Image
            src="/proximamente/nippon-game-logo.png"
            alt="Logo Nippon Game"
            width={300}
            height={180}
            className="object-contain"
          />
        </div>

        {/* Mario */}
        <div className="hidden lg:block">
          <Image
            src="/proximamente/mario-nippongame.png"
            alt="Mario Nippon Game"
            width={130}
            height={130}
            className="object-contain drop-shadow-lg"
          />
        </div>
      </div>

      {/* Solo en mobile: Mario debajo del logo */}
      <div className="lg:hidden mt-6">
        <Image
          src="/proximamente/mario-nippongame.png"
          alt="Mario Nippon Game"
          width={130}
          height={130}
          className="object-contain drop-shadow-lg"
        />
      </div>

      {/* Subtítulo */}
      <p className="text-sm font-bold sm:text-base md:text-lg mt-8 mb-4 z-10 text-center">
        Estamos trabajando para traerte algo increíble.
      </p>

      {/* Mensaje de contacto */}
      <p className="text-sm font-bold sm:text-base md:text-lg mb-6 z-10 text-center">
        Mientras tanto, contáctanos en:
      </p>

      {/* Iconos de contacto */}
      <div className="flex justify-center space-x-4 mb-6 z-10">
        <div className="cursor-pointer p-3 text-white rounded-full bg-red-500/90 hover:bg-red-800 transition duration-200 ease-in-out flex items-center justify-center hover:shadow-lg hover:scale-105">
          <Link href="https://maps.app.goo.gl/cCr4VrpNMuDqTppJA">
            <MapsIcon className="w-6 h-6" />
          </Link>
        </div>
        <div className="cursor-pointer p-3 text-white rounded-full bg-red-500/90 hover:bg-red-800 transition duration-200 ease-in-out flex items-center justify-center hover:shadow-lg hover:scale-105">
          <Link href="mailto:nippongame@gmail.com">
            <MailIcon className="w-6 h-6" />
          </Link>
        </div>
        <div className="cursor-pointer p-3 text-white rounded-full bg-red-500/90 hover:bg-red-800 transition duration-200 ease-in-out flex items-center justify-center hover:shadow-lg hover:scale-105">
          <Link href="https://wa.me/5491154041650?text=Hola%20Nippon%20Game.%20Quiero%20realizar%20una%20consulta!">
            <WhatsappIcon className="w-6 h-6" />
          </Link>
        </div>
      </div>
    </div>
  );
}

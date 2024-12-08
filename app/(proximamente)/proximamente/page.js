import Image from 'next/image';
import WhatsappIcon from '@/icons/WhatsappIcon';
import MailIcon from '@/icons/MailIcon';
import Link from 'next/link';
import MapsIcon from '@/icons/MapsIcon';

export default function Proximamente() {
  return (
    <div className="h-screen bg-[#00091B] text-white flex items-center justify-center px-4">
      {/* Capa de luz centrada detrás de los elementos */}
      <div className="absolute inset-0 bg-gradient-radial from-[#FF3B3F] via-[#00091B] to-transparent opacity-60"></div>

      {/* Contenedor principal */}
      <div className="relative text-center max-w-3xl z-10 flex flex-col items-center justify-center">
        
        {/* Título */}
        <h1 className="text-4xl sm:text-4xl md:text-4xl font-bold leading-tight mb-6 relative top-12">
          Próximamente<span className="text-red-500">.</span>
        </h1>

        {/* En pantallas grandes (LG) y superiores, Sonic y Mario deben separarse */}
        <div className="flex flex-col lg:flex-row justify-center lg:gap-20 mb-10 items-center relative top-20 ">
          {/* Sonic */}
          <div className="hidden lg:block w-1/6 drop-shadow-2xl relative top-10">
            <Image
              src="/proximamente/sonic-nippongame.png"
              alt="Sonic Nippon Game"
              width={150}
              height={150}
              className="object-contain"
            />
          </div>

          {/* Logo centrado */}
          <div className="w-full sm:w-2/3 md:w-1/2 lg:w-2/3 mx-auto mb-6 flex justify-center">
            <Image
              src="/nippon-game-logo.png"
              alt="Logo Nippon Game"
              width={700}
              height={400}
              className="object-contain"
            />
          </div>

          {/* Mario */}
          <div className="hidden relative lg:block w-1/6 drop-shadow-2xl top-10">
            <Image
              src="/proximamente/mario-nippongame.png"
              alt="Mario Nippon Game"
              width={270}
              height={270}
              className="object-contain"
            />
          </div>
        </div>

        {/* Subtítulo */}
        <p className="text-base font-bold sm:text-lg md:text-xl mb-10 relative top-10">
          Estamos trabajando para traerte algo increíble.
        </p>

        {/* Mensaje de contacto */}
        <p className="text-base  font-bold sm:text-lg md:text-xl mb-10 relative top-10">
          Mientras tanto, contáctanos en:
        </p>

        {/* Iconos de contacto */}
        <div className="flex justify-center space-x-8 mb-10 relative top-10">
          <div className="cursor-pointer p-5 text-white rounded-full bg-red-500/90 hover:bg-red-800 transition duration-200 ease-in-out flex items-center justify-center hover:shadow-2xl hover:scale-105">
            <Link href="https://maps.app.goo.gl/cCr4VrpNMuDqTppJA">
              <MapsIcon className="w-10 h-10" />
            </Link>
          </div>
          <div className="cursor-pointer p-5 text-white rounded-full bg-red-500/90 hover:bg-red-800 transition duration-200 ease-in-out flex items-center justify-center hover:shadow-2xl hover:scale-105">
            <Link href="mailto:nippongame@gmail.com">
              <MailIcon className="w-10 h-10" />
            </Link>
          </div>
          <div className="cursor-pointer p-5 text-white rounded-full bg-red-500/90 hover:bg-red-800 transition duration-200 ease-in-out flex items-center justify-center hover:shadow-2xl hover:scale-105">
            <Link href="https://wa.me/5491154041650?text=Hola%20Nippon%20Game.%20Quiero%20realizar%20una%20consulta!">
              <WhatsappIcon className="w-10 h-10" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

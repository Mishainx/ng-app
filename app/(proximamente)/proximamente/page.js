import Image from 'next/image'

export default function Proximamente() {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-black bg-gradient-radial from-black via-transparent to-transparent">
      {/* Título */}
      <h1 className="text-5xl sm:text-6xl md:text-6xl font-bold text-center text-red-500 mb-12 drop-shadow-md relative top-20">
        Próximamente
      </h1>

      {/* Banner con luz alrededor */}
      <div className="w-full flex items-center justify-center relative">
        <div className="absolute inset-0 bg-gradient-radial from-white via-transparent to-transparent opacity-30 rounded-full"></div>
        <Image
          src="/proximamente/proximamente-nippongame-videojuegos.png" // Ruta de tu logo
          alt="Logo"
          width={1500} // Aumenté el tamaño máximo de la imagen
          height={1500} // Aumenté el tamaño máximo de la imagen
          className="w-3/4 sm:w-2/3 md:w-1/2 lg:w-1/4 xl:w-1/6 max-w-xs drop-shadow-lg" // Ajustes para mantener la imagen centrada y escalada
        />
      </div>
    </div>
  );
}

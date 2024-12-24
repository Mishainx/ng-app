"use client";

import Image from "next/image";

export default function CustomHero({ title, description, img }) {
  return (
    <div className="relative flex flex-col sm:flex-row w-full h-auto sm:h-[50vh] bg-black text-white mb-5">
      {/* Imagen */}
      <div className="relative w-full h-[40vh] sm:w-1/2 sm:h-full overflow-hidden lg:py-6 lg:px-6 translate-y-7 sm:translate-y-0">
        <Image
          src={img}
          alt={title}
          fill
          className="object-contain scale-90 transition-transform duration-300 brightness-100 hover:brightness-110 shadow-lg drop-shadow-lg"
        />
        {/* Efecto de luces */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/20"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent  to-black/20"></div>
      </div>

      {/* Texto */}
      <div className="relative flex flex-col justify-center items-center sm:items-start p-8 sm:w-1/2">
        {/* Degradado de transición entre texto e imagen */}
        <div className="absolute top-0 left-0 right-0 h-8 sm:h-full sm:w-8 bg-gradient-to-r from-black to-transparent sm:bg-gradient-to-b"></div>

        {/* Títulos con gradiente */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold uppercase mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-300 to-gray-400">
          {title}
        </h1>

        {/* Línea de gradiente */}
        <div className="h-1 bg-gradient-to-r from-red-400 via-red-700 to-red-800 mb-2 w-24 sm:w-64 sm:md:w-64"></div>

        {/* Descripción */}
        {description && (
          <p className="text-center sm:text-start text-lg sm:text-xl text-gray-300">
            {description}
          </p>
        )}

        {/* Texto por defecto */}
        {!description && (
          <p className="text-center sm:text-start text-lg sm:text-xl text-gray-300">
            Explora nuestras colecciones únicas y encuentra lo que estás buscando.
          </p>
        )}
      </div>
    </div>
  );
}

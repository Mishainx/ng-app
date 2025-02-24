"use client";

import { useCategories } from "@/context/CategoriesContext";
import Image from "next/image";

export default function CategoriesHero({ selectedCategory, selectedSubCategory }) {
  const { categories } = useCategories();

  // Filtrar la categoría seleccionada
  const category = categories.find(cat => cat.slug === selectedCategory);

  if (!category) return null;

  // Lógica para determinar la imagen, título y descripción
  let bannerImage;
  let mainTitle;
  let subTitle;
  let description;

  // Verificamos si hay una subcategoría
  const subcategory = category?.subcategories?.find(sub => sub.slug === selectedSubCategory);

  if (subcategory) {
    bannerImage = subcategory.img || category.img;
    mainTitle = subcategory.title;
    subTitle = category.title;
  } else {
    bannerImage = category.img;
    mainTitle = category.title;
    description = category.description;
  }

  // Definimos un ancho fijo para el subrayado

  return (
    <div className="relative flex flex-col sm:flex-row w-full h-auto sm:h-[50vh] bg-black text-white mb-5">
      {/* Imagen */}
      <div className="relative w-full h-[40vh] sm:w-1/2 sm:h-full overflow-hidden lg:py-6 lg:px-6 translate-y-7 sm:translate-y-0">
        <Image
          src={bannerImage}
          alt={mainTitle}
          fill
          className="object-contain scale-90 transition-transform duration-300 brightness-100 hover:brightness-110 shadow-lg drop-shadow-lg"
        />
        {/* Efecto de luces */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/40"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/40"></div>
      </div>

      {/* Texto */}
      <div className="relative flex flex-col justify-center items-center sm:items-start p-8 sm:w-1/2">
        {/* Degradado de transición entre texto e imagen */}
        <div className="absolute top-0 left-0 right-0 h-8 sm:h-full sm:w-8 bg-gradient-to-r from-black to-transparent sm:bg-gradient-to-b"></div>

        {/* Títulos con gradiente */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold uppercase mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-300 to-gray-400">
          {mainTitle}
        </h1>

        <div
          className={`h-1 bg-gradient-to-r from-red-400 via-red-700 to-red-800 mb-2  ${!subTitle && 'w-48'} w-24 sm:w-64 sm:md:w-64`}
        ></div>

        {subTitle && (
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-medium uppercase text-gray-400 mb-4">
            {subTitle}
          </h2>
        )}



        {/* Descripción */}
        {description && (
          <p className="text-center sm:text-start text-lg sm:text-xl text-gray-300">
            {description}
          </p>
        )}

        {/* Texto general */}
        {!description && !subTitle && (
          <p className="text-center sm:text-start text-lg sm:text-xl text-gray-300">
            Explora nuestras colecciones únicas y encuentra lo que estás buscando.
          </p>
        )}
      </div>
    </div>
  );
}

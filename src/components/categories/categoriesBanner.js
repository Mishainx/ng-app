"use client";

import { useCategories } from "@/context/CategoriesContext";
import Image from "next/image";

export default function CategoriesBanner({ selectedCategory, selectedSubCategory }) {
  const { categories } = useCategories();

  // Filtrar la categoría seleccionada
  const category = categories.find(cat => cat.slug === selectedCategory);

  if (!category) return null; // Si no se encuentra la categoría, no renderizar nada

  // Lógica para determinar la imagen a mostrar
  let bannerImage;
  let bannerTittle;

  const subcategory = category?.subcategories?.find(sub => sub.slug === selectedSubCategory);

  if (subcategory) {
    bannerImage = subcategory?.img || category.img; // Usa la imagen de la subcategoría o de la categoría
    bannerTittle = subcategory?.title || category.title;
  } else {
    bannerImage = category.img; // Solo hay categoría, usar la imagen de la categoría
    bannerTittle = category.title;
  }

  return (
    <div className="relative w-full h-[30vh] sm:h-[40vh] md:h-[50vh] lg:h-[40vh] mb-3">
      {/* Imagen de fondo con el tamaño responsivo */}
      <Image
        src={bannerImage} // URL de la imagen determinada
        alt={bannerTittle} // Texto alternativo
        fill // Hace que la imagen llene el contenedor
        className="object-cover w-full h-full transition-transform duration-300" // Ajustes para cubrir el área
      />
      {/* Overlay de gradiente con opacidad ajustada */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-50"></div>

      {/* Contenedor para el título de la categoría */}
      <div className="absolute inset-0 flex items-center justify-center px-4">
        <div className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold uppercase text-center max-w-[90%] md:max-w-[80%]">
          <h1>{bannerTittle}</h1>
        </div>
      </div>
    </div>
  );
}

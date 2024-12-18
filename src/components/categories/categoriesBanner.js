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
    console.log(subcategory)

  } else {
    bannerImage = category.img;
    bannerTittle = category.title // Solo hay categoría, usar la imagen de la categoría
  }

  return (
    <div className="relative w-full h-[200px] mb-3">
      <Image
        src={bannerImage} // URL de la imagen determinada
        alt={bannerTittle} // Texto alternativo
        fill // Hace que la imagen llene el contenedor
        className="object-cover w-full h-full transition-transform duration-300" // Ajustes para cubrir el área
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-70"> {/* Overlay de gradiente con opacidad ajustada */}
      </div>
      <div className="absolute inset-0 flex items-center justify-center"> {/* Texto centrado */}
        <div className="text-white text-4xl font-bold uppercase text-center">
          <h1>{bannerTittle}</h1>
        </div>
      </div>
    </div>
  );
}
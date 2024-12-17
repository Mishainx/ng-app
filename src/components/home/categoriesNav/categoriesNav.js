"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useCategories } from "@/context/CategoriesContext";
import { capitalizeFirstLetter } from "@/utils/stringsManager";

const CategoriesNav = () => {
  const [scrollLeft, setScrollLeft] = useState(0);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const containerRef = useRef(null);
  const { categories } = useCategories();

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      const updateOverflow = () => {
        setIsOverflowing(container.scrollWidth > container.clientWidth);
      };

      // Initial check
      updateOverflow();

      // Add event listener to check overflow when resized
      window.addEventListener("resize", updateOverflow);

      // Clean up event listener
      return () => window.removeEventListener("resize", updateOverflow);
    }
  }, []); // Eliminamos 'categories' de las dependencias

  const handleScrollLeft = () => {
    const container = containerRef.current;
    if (container) {
      container.scrollBy({ left: -200, behavior: "smooth" });
      setScrollLeft(container.scrollLeft - 200);
    }
  };

  const handleScrollRight = () => {
    const container = containerRef.current;
    if (container) {
      container.scrollBy({ left: 200, behavior: "smooth" });
      setScrollLeft(container.scrollLeft + 200);
    }
  };

  // Filtrar categorías donde showInMenu sea true
  const filteredCategories = categories.filter(category => category.showInMenu);

  return (
    <section className="w-full flex flex-col items-center justify-center">
      <div className="overflow-hidden w-full flex items-center justify-between px-4 lg:px-12">
        {/* Flecha izquierda */}
        {isOverflowing && (
          <button
            onClick={handleScrollLeft}
            className="w-12 h-12 flex items-center justify-center p-3 bg-white rounded-full shadow-lg transform hover:scale-110 transition duration-200"
          >
            <span className="text-xl text-gray-600">&lt;</span>
          </button>
        )}

        {/* Contenedor de categorías */}
        <div
          ref={containerRef}
          id="categories-container"
          className="flex space-x-6 p-4 overflow-x-auto scrollbar-hide"
        >
          {filteredCategories.map((category) => (
            <Link href={`categorias/${category.slug}`} key={category.slug}>
              <button className="block p-6 rounded-xl hover:bg-gray-100 transform hover:-translate-y-1 transition duration-300 w-full flex flex-col items-center">
                <div className="relative w-20 h-20">
                  <Image
                    src={category.icon}
                    fill={true}
                    alt={`${category.title} category`}
                    className="hover:scale-110 transition-transform duration-700 ease-in-out"
                  />
                </div>
                <h3 className="mt-2 text-center text-sm font-medium text-gray-700">{capitalizeFirstLetter(category.title)}</h3>
              </button>
            </Link>
          ))}
        </div>

        {/* Flecha derecha */}
        {isOverflowing && (
          <button
            onClick={handleScrollRight}
            className="w-12 h-12 flex items-center justify-center p-3 bg-white rounded-full shadow-lg transform hover:scale-110 transition duration-200"
          >
            <span className="text-xl text-gray-600">&gt;</span>
          </button>
        )}
      </div>
    </section>
  );
};

export default CategoriesNav;

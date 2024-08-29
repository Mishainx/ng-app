"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import categories from "../../../data/categories.json";

const CategoriesNav = () => {
  const [scrollLeft, setCategoriesList, setScrollLeft] = useState(0);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      const updateOverflow = () => {
        setIsOverflowing(container.scrollWidth > container.clientWidth);
      };

      // Initial check
      updateOverflow();

      // Add event listener to check overflow when resized
      window.addEventListener('resize', updateOverflow);

      // Clean up event listener
      return () => window.removeEventListener('resize', updateOverflow);
    }
  }, []); // Aquí eliminamos 'categories' de las dependencias

  const handleScrollLeft = () => {
    const container = containerRef.current;
    if (container) {
      container.scrollBy({ left: -200, behavior: "smooth" }); // Ajusta este valor según sea necesario
      setScrollLeft(container.scrollLeft - 200);
    }
  };

  const handleScrollRight = () => {
    const container = containerRef.current;
    if (container) {
      container.scrollBy({ left: 200, behavior: "smooth" }); // Ajusta este valor según sea necesario
      setScrollLeft(container.scrollLeft + 200);
    }
  };

  return (
    <section className="w-full flex flex-col items-center justify-center">
      <div className="overflow-hidden w-full flex items-center justify-evenly px-4">
        {isOverflowing && (
          <button
            onClick={handleScrollLeft}
            className="w-10 h-10 flex items-center justify-center p-2 bg-white rounded-full shadow-md z-10"
          >
            &#8249;
          </button>
        )}
        <div
          ref={containerRef}
          id="categories-container"
          className="flex space-x-6 p-2 overflow-x-auto scrollbar-hide me-4 md:me-0"
        >
          {categories.map((category) => (
            <Link href={category.href} key={category.categoryId}>
              <button className="p-4 rounded-lg hover:bg-gray-200 hover:shadow-lg transform hover:-translate-y-1 transition duration-200">
                <div className="flex flex-col">
                  <div className="relative w-24 h-24">
                    <Image
                      src={category.srcMenu}
                      fill={true}
                      alt={`${category.title} category`}
                      className="hover:scale-110 transition-transform duration-700 ease-in-out"
                    />
                  </div>
                  <h3>{category.title}</h3>
                </div>
              </button>
            </Link>
          ))}
        </div>
        {isOverflowing && (
          <button
            onClick={handleScrollRight}
            className="w-10 h-10 flex items-center justify-center p-2 bg-white rounded-full shadow-md z-10"
          >
            &#8250;
          </button>
        )}
      </div>
    </section>
  );
};

export default CategoriesNav;

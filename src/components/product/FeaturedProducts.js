"use client";

import { useState, useEffect, useRef } from "react";
import ProductCard from "./productCard";

const FeaturedProducts = ({ featuredProducts }) => {
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
      window.addEventListener("resize", updateOverflow);

      // Clean up event listener
      return () => window.removeEventListener("resize", updateOverflow);
    }
  }, []);

  const handleScrollLeft = () => {
    const container = containerRef.current;
    if (container) {
      container.scrollBy({ left: -200, behavior: "smooth" });
    }
  };

  const handleScrollRight = () => {
    const container = containerRef.current;
    if (container) {
      container.scrollBy({ left: 200, behavior: "smooth" });
    }
  };

  return (
    <section className="w-11/12 py-10 px-4 mx-auto max-w-6xl">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold">Destacados</h2>
        <div className="inline-block w-24 h-1 bg-red-500 mt-2"></div>
      </div>

      <div className="relative w-full flex items-center">
        {/* Flecha izquierda */}
        {isOverflowing && (
          <button
            onClick={handleScrollLeft}
            className="absolute -left-7 top-1/2 transform -translate-y-1/2 p-2 rounded-full shadow-md bg-white hover:bg-gray-300 focus:outline-none z-10"
          >
            &#10094;
          </button>
        )}

        {/* Contenedor de productos */}
        <div
          ref={containerRef}
          id="featured-slider"
          className="flex items-center h-80 overflow-x-auto whitespace-nowrap scroll-smooth no-scrollbar relative"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {featuredProducts?.length > 0 ? (
            featuredProducts.map((product, index) => (
              <div
                className="flex-shrink-0 rounded-lg p-4 whitespace-normal transform transition-transform duration-300 overflow-visible"
                key={`${product.id}-${index}`}
              >
                <ProductCard product={product} />
              </div>
            ))
          ) : (
            <p>No hay productos destacados disponibles.</p>
          )}
        </div>

        {/* Flecha derecha */}
        {isOverflowing && (
          <button
            onClick={handleScrollRight}
            className="absolute -right-7 top-1/2 transform -translate-y-1/2 p-2 rounded-full shadow-md bg-white hover:bg-gray-300 focus:outline-none z-10"
          >
            &#10095;
          </button>
        )}
      </div>
    </section>
  );
};

export default FeaturedProducts;

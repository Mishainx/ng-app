"use client";

import { useEffect, useRef } from "react";
import products from "../../data/products.json";
import ProductCard from "./productCard";

const FeaturedProducts = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;

    if (!container) return;

    const scrollStep = 1.2; // Velocidad del desplazamiento más suave
    const scrollInterval = 16; // Intervalo de actualización para suavidad
    let scrollAmount = 0;

    const animateScroll = () => {
      if (scrollAmount >= container.scrollWidth / 2) {
        container.scrollLeft = 0;
        scrollAmount = 0;
      } else {
        scrollAmount += scrollStep;
        container.scrollLeft = scrollAmount;
      }

      setTimeout(() => requestAnimationFrame(animateScroll), scrollInterval); // Continuar la animación
    };

    animateScroll(); // Iniciar la animación

    // Cleanup on component unmount
    return () => cancelAnimationFrame(animateScroll);
  }, []);

  // Duplicate the products to create an infinite scroll effect
  const featuredProducts = products.filter(product => product.featured);
  const duplicatedProducts = [...featuredProducts, ...featuredProducts];

  return (
    <section className="relative py-12 px-4 mx-auto max-w-6xl">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold">Destacados</h2>
        <div className="inline-block w-24 h-1 bg-red-500 mt-2"></div>
      </div>
      <div className="overflow-hidden w-full flex items-center px-4">
        <div
          ref={containerRef}
          className="flex space-x-6 p-2 overflow-x-hidden whitespace-nowrap"
        >
          {duplicatedProducts.map((product, index) => (
            <div className="inline-block" key={`${product.id}-${index}`}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;

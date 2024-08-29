"use client";

import { useRef, useState } from "react";
import products from "../../data/products.json";
import ProductCard from "./productCard";

const FeaturedProducts = () => {
  const containerRef = useRef(null);
  const [startTouchX, setStartTouchX] = useState(0);
  const [isTouching, setIsTouching] = useState(false);

  // Funciones para el desplazamiento manual
  const scrollLeft = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({
        left: -containerRef.current.clientWidth / 2,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({
        left: containerRef.current.clientWidth / 2,
        behavior: "smooth",
      });
    }
  };

  // Funciones para el desplazamiento táctil
  const handleTouchStart = (e) => {
    setIsTouching(true);
    setStartTouchX(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    if (!isTouching) return;
    const touchEndX = e.touches[0].clientX;
    const diffX = startTouchX - touchEndX;

    if (Math.abs(diffX) > 50) { // Ajustar sensibilidad si es necesario
      if (diffX > 0) {
        scrollRight();
      } else {
        scrollLeft();
      }
      setIsTouching(false); // Terminar el evento táctil después de desplazar
    }
  };

  const handleTouchEnd = () => {
    setIsTouching(false);
  };

  const featuredProducts = products.filter((product) => product.featured);

  return (
    <section className="relative py-10 px-2 mx-auto max-w-6xl">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold">Destacados</h2>
        <div className="inline-block w-24 h-1 bg-red-500 mt-2"></div>
      </div>
      <div className="relative flex items-center">
        <button
          className="absolute left-0 w-10 h-10 flex items-center justify-center p-2 bg-white rounded-full shadow-md z-10"
          onClick={scrollLeft}
          style={{ top: '50%', transform: 'translateY(-50%)' }}
        >
          &lt;
        </button>
        <div
          ref={containerRef}
          className="flex overflow-x-auto whitespace-nowrap h-full w-full"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={{
            overflow: 'hidden',  // Oculta las barras de desplazamiento
            scrollBehavior: 'smooth',
          }}
        >
          {featuredProducts.map((product, index) => (
            <div className="flex-shrink-0 w-36 h-64" key={`${product.id}-${index}`}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
        <button
          className="absolute right-0 w-10 h-10 flex items-center justify-center p-2 bg-white rounded-full shadow-md z-10"
          onClick={scrollRight}
          style={{ top: '50%', transform: 'translateY(-50%)' }}
        >
          &gt;
        </button>
      </div>
    </section>
  );
};

export default FeaturedProducts;

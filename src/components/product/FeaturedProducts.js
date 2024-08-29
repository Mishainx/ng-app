"use client";

import { useRef, useState, useEffect } from "react";
import products from "../../data/products.json";
import ProductCard from "./productCard";

const FeaturedProducts = () => {
  const containerRef = useRef(null);
  const [startTouchX, setStartTouchX] = useState(0);
  const [isTouching, setIsTouching] = useState(false);

  const scrollLeft = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: -200, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: 200, behavior: "smooth" });
    }
  };

  const handleTouchStart = (e) => {
    setIsTouching(true);
    setStartTouchX(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    if (!isTouching) return;
    const touchEndX = e.touches[0].clientX;
    const diffX = startTouchX - touchEndX;
    
    if (Math.abs(diffX) > 50) { // Adjust sensitivity as needed
      if (diffX > 0) {
        scrollRight();
      } else {
        scrollLeft();
      }
      setIsTouching(false); // End touch event after scrolling
    }
  };

  const handleTouchEnd = () => {
    setIsTouching(false);
  };

  const featuredProducts = products.filter((product) => product.featured);

  return (
    <section className="relative py-10 px-4 mx-auto max-w-6xl">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold">Destacados</h2>
        <div className="inline-block w-24 h-1 bg-red-500 mt-2"></div>
      </div>
      <div className="relative flex items-center">
        <button
          className="w-10 h-10 flex items-center justify-center p-2 bg-white rounded-full shadow-md z-10"
          onClick={scrollLeft}
          style={{ top: '50%', transform: 'translateY(-50%)' }}
        >
          &lt;
        </button>
        <div
          ref={containerRef}
          className="flex space-x-2 overflow-x-hidden h-full px-10 scrollbar-hide ml-10 mr-10"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {featuredProducts.map((product, index) => (
            <div className="flex items-stretch p-2" key={`${product.id}-${index}`}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
        <button
          className="w-10 h-10 flex items-center justify-center p-2 bg-white rounded-full shadow-md z-10"
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

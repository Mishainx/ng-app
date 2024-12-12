"use client";

import { useState, useEffect } from "react";
import ProductCard from "./productCard";

const FeaturedProducts = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  // Fetch data only once
  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/featured`, { next: { revalidate: 3600 }});
        const data = await response.json();
        setFeaturedProducts(data.payload || []); // Set products in state
        setLoading(false); // Set loading to false when data is fetched
      } catch (error) {
        console.error("Error fetching featured products:", error);
        setLoading(false); // Set loading to false if there is an error
      }
    };

    fetchFeaturedProducts();
  }, []);

  // Handle scroll for slider buttons
  const scrollSlider = (direction) => {
    const slider = document.getElementById("featured-slider");
    const scrollAmount = 300; // Amount to scroll

    if (direction === "left") {
      slider.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    } else {
      slider.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Cargando productos destacados...</p>
      </div>
    );
  }

  return (
    <section className="w-11/12 py-10 px-4 mx-auto max-w-6xl">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold">Destacados</h2>
        <div className="inline-block w-24 h-1 bg-red-500 mt-2"></div>
      </div>

      {/* Slider controls */}
      <div className="relative">
        <button
          onClick={() => scrollSlider("left")}
          className="absolute -left-7 top-1/2 transform -translate-y-1/2 p-2 rounded-full shadow-md hover:bg-gray-400 focus:outline-none z-10 ml-2"
        >
          &#10094;
        </button>
        <button
          onClick={() => scrollSlider("right")}
          className="absolute -right-7 top-1/2 transform -translate-y-1/2 p-2 rounded-full shadow-md hover:bg-gray-400 focus:outline-none z-10 mr-2"
        >
          &#10095;
        </button>

        <div
          id="featured-slider"
          className="flex items-center h-80  overflow-x-hidden overflow-y-visible whitespace-nowrap scroll-smooth no-scrollbar"
        >
          {featuredProducts?.length > 0 ? (
            featuredProducts
              .map((product, index) => (
                <div
                  className="flex-shrink-0  rounded-lg p-4 whitespace-normal transform transition-transform duration-300 hover:scale-105 overflow-visible"
                  key={`${product.id}-${index}`}
                >
                  <ProductCard product={product} />
                </div>
              ))
          ) : (
            <p>No hay productos destacados disponibles.</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;

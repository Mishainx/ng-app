"use client"

// OfferProducts.js
import { useState, useEffect } from "react";
import ProductCard from "../product/productCard";
import Loader from "../loader/Loader";

const OfferProducts = () => {
  const [offerProducts, setOfferProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch data only once
  useEffect(() => {
    const fetchOfferProducts = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/offers`, {
          cache: "no-store",
        });
        const data = await response.json();
        setOfferProducts(data.payload || []); // Set products in state
        setLoading(false); // Set loading to false when data is fetched
      } catch (error) {
        console.error("Error fetching offer products:", error);
        setLoading(false); // Set loading to false if there is an error
      }
    };

    fetchOfferProducts();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader />
      </div>
    );
  }

  return (
    <section className="py-10 px-4 mx-auto max-w-7xl">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold">Ofertas</h2>
        <div className="inline-block w-24 h-1 bg-red-500 mt-2"></div>
      </div>

      {/* Grid layout for products */}
      <div className="grid grid-cols-2 xxs:grid-cols-2 ss:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2">
        {offerProducts.length > 0 ? (
          offerProducts
            .filter((product) => product.img) // Filtrar productos sin imagen
            .map((product, index) => (
              <div
                className="flex-shrink-0 rounded-lg transform transition-transform duration-300 hover:scale-105 overflow-visible mx-2 my-2"
                key={`${product.id}-${index}`}
              >
                <ProductCard product={product} />
              </div>
            ))
        ) : (
          <p>No hay productos en oferta disponibles.</p>
        )}
      </div>
    </section>
  );
};

export default OfferProducts;

"use client";

import { useState, useEffect } from "react";
import OfferProducts from "@/components/offers/offers";

export default function Ofertas() {
  const [offersProducts, setOffersProducts] = useState([]);
  
  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/products/offers`,
          { cache: "no-cache" }
        );
        const products = await response.json();
        setOffersProducts(products.payload || []); // Actualiza el estado con los productos
      } catch (error) {
        console.error("Error fetching featured products:", error);
      }
    };

    fetchOffers();
  }, []); // El array vacío asegura que solo se ejecute una vez al montar el componente

  return (
    <main>
      <div className="h-full">
        {/* Banner responsivo */}
        <div className="relative w-full h-48 bg-cover bg-center overflow-hidden mb-6">
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <h2 className="text-3xl font-bold text-white text-center">¡Ofertas Especiales!</h2>
          </div>
        </div>

        {/* Componente de productos en oferta */}
        <OfferProducts offersProducts={offersProducts} />
      </div>
    </main>
  );
}

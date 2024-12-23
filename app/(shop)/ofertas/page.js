"use client"

import OffersProducts from "@/components/offers/offers";
import { useProducts } from "@/context/ProductsContext";

export default function Ofertas() {
  const { products, error } = useProducts(); // Obtener los productos desde el contexto

  // Filtrar productos que están en oferta (discount > 0)
  const offersProducts = products.filter((product) => product.discount > 0); 


  if (error) {
    return <p>Error: {error}</p>; // Mostrar un mensaje de error en caso de que haya un fallo
  }

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
        <OffersProducts offersProducts={offersProducts} />
      </div>
    </main>
  );
}

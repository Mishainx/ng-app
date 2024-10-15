import { useState } from "react";
import ProductCard from "../product/productCard";
import ArrowIcon from "@/icons/ArrowIcon";

export default function CatalogueList({ products }) {
  const [visibleCount, setVisibleCount] = useState(20); // Mostrar inicialmente 20 productos

  // Función para cargar más productos
  const loadMore = () => {
    setVisibleCount((prevCount) => prevCount + 20); // Aumentar en 20 el conteo visible
  };

  return (
    <div>
      {/* Usar grid para alinear las tarjetas */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 xxs:p-10">
        {products?.slice(0, visibleCount).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Mostrar enlace "Cargar más" si hay más productos por cargar */}
      <div>
        {visibleCount < products.length && (
          <span
            onClick={loadMore}
            className="mt-4 cursor-pointer hover:underline flex items-center justify-center gap-2"
          >
            Cargar más
            <ArrowIcon className={"w-3 h-3 transform rotate-90"} />
          </span>
        )}
      </div>
    </div>
  );
}

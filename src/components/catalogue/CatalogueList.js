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
            <div className="flex flex-wrap items-center justify-center gap-5 flex-grow p-1 xxs:p-10">
      {products?.slice(0, visibleCount).map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}

      {/* Mostrar enlace "Cargar más" si hay más productos por cargar */}
    </div>
    <div>
              {visibleCount < products.length && (
        <span
          onClick={loadMore}
          className="mt-4 cursor-pointer hover:underline flex  items-center justify-center gap-2"
        >
          Cargar más
          <ArrowIcon className={"w-3 h-3 transform rotate-90"} />        </span>
      )}
    </div>
    </div>

  );
}

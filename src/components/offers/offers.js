"use client";
import { useState, useEffect } from "react";
import ProductCard from "../product/productCard";
import Loader from "../loader/Loader";
import ArrowIcon from "@/icons/ArrowIcon";
import { usePage } from "@/context/PageContext";

export default function OffersProducts({ offersProducts = [] }) {
  const { currentPage, setCurrentPage } = usePage();
  const [isPageChanging, setIsPageChanging] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [loading, setLoading] = useState(true); // Manejamos el estado de carga

  useEffect(() => {
    // Si 'offersProducts' está vacío, mostramos que no hay productos disponibles
    if (offersProducts.length === 0) {
      setLoading(false); // No es necesario seguir cargando si no hay productos
    }
  }, [offersProducts]);

  // Si no hay productos, totalPages será 0
  const totalPages = offersProducts.length ? Math.ceil(offersProducts.length / itemsPerPage) : 0;

  const startIndex = (currentPage - 1) * itemsPerPage;
  const visibleProducts = offersProducts.slice(startIndex, startIndex + itemsPerPage);
  const totalVisibleProducts = offersProducts.filter((product) => product.visible).length;

  const goToPage = (page) => {
    if (page > 0 && page <= totalPages) {
      setIsPageChanging(true); // Activamos la animación
      setTimeout(() => {
        setCurrentPage(page);
        setIsPageChanging(false); // Terminamos la animación
      }, 500); // Retraso para la transición más suave
    }
    window.scrollTo({
      top: 0, // Posición superior
    });
  };

  const handleItemsPerPageChange = (e) => {
    const newItemsPerPage = parseInt(e.target.value, 10);
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Resetear a la primera página cuando se cambia el número de items por página
  };

  if (loading && offersProducts.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader />
      </div>
    );
  }

  if (offersProducts.length === 0) {
    return (
      <div className="text-center py-10">
        <h2 className="text-xl font-semibold text-gray-900">No hay productos disponibles en oferta </h2>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-5 px-4">
      <section className="text-center mb-2">
        <h2 className="text-2xl font-semibold text-gray-900">Aprovecha nuestros descuentos increíbles</h2>
        <div className="inline-block w-24 h-1 bg-red-500 mt-2"></div>
      </section>

      <div
        className={`grid grid-cols-2 xxs:grid-cols-2 ss:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-5 lg:gap-7 xxs:p-10 ${
          isPageChanging
            ? "opacity-0 transition-opacity duration-1000 ease-in-out"
            : "opacity-100 transition-opacity duration-1000 ease-in-out"
        }`}
      >
        {visibleProducts
          .filter((product) => product.visible) // Filtrar productos visibles
          .map((product) => (
            <div
              key={product.slug}
              className="flex-shrink-0 w-full sm:w-[calc(25%_-_1rem)] md:w-[calc(20%_-_1rem)] lg:w-[calc(16%_-_1rem)] mb-4"
            >
              <ProductCard product={product} />
            </div>
          ))}
      </div>

      {/* Mostrar paginación solo si hay más de 10 productos visibles */}
      {totalVisibleProducts > 10 && (
        <div className="mt-6 flex flex-col sm:flex-row sm:justify-center items-center gap-4">
          {/* Controles de paginación */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className={`p-3 transition-all duration-300 ease-in-out rounded-lg ${
                currentPage === 1
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-red-500 hover:bg-gray-100"
              }`}
            >
              <ArrowIcon className="w-5 h-5 transform rotate-180" />
            </button>

            <span className="text-sm text-gray-600 font-semibold">
              Página {currentPage} de {totalPages}
            </span>

            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`p-3 transition-all duration-300 ease-in-out rounded-lg ${
                currentPage === totalPages
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-red-500 hover:bg-gray-100"
              }`}
            >
              <ArrowIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Selector de productos por página */}
          <div className="flex items-center gap-4 text-gray-600">
            <span className="text-sm font-semibold">Mostrar</span>
            <select
              value={itemsPerPage}
              onChange={handleItemsPerPageChange}
              className="border-2 border-gray-300 rounded-lg p-2 text-sm transition-all duration-300 ease-out focus:ring-2 focus:ring-red-500 focus:border-red-500 hover:bg-gray-100"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={30}>30</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
}

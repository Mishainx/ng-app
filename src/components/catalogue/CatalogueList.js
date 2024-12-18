"use client";
import { useEffect, useState } from "react";
import ProductCard from "../product/productCard";
import ArrowIcon from "@/icons/ArrowIcon";
import { usePage } from "@/context/PageContext";

export default function CatalogueList({ products, loading }) {
  const { currentPage, setCurrentPage } = usePage();
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [isPageChanging, setIsPageChanging] = useState(false);

  const totalPages = Math.ceil(products.length / itemsPerPage);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/users/profile`,
          { method: "GET" }
        );

        if (!response.ok) {
          setUserData(null);
          setLoading(false);
          return;
        }

        const data = await response.json();
        setUserData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  if (isLoading) {
    return <p className="text-gray-500 text-sm">Cargando...</p>;
  }

  if (error) {
    return <p className="text-red-500 text-sm">Error: {error}</p>;
  }

  const startIndex = (currentPage - 1) * itemsPerPage;
  const visibleProducts = products.slice(startIndex, startIndex + itemsPerPage);

  const goToPage = (page) => {
    if (page > 0 && page <= totalPages) {
      setIsPageChanging(true); // Activamos la animación
      setTimeout(() => {
        setCurrentPage(page);
        setIsPageChanging(false); // Terminamos la animación
      }, 500); // Retraso más largo para hacer la transición más suave
    }
    window.scrollTo({
      top: 0, // Posición superior
    });
  };

  const handleItemsPerPageChange = (e) => {
    const newItemsPerPage = parseInt(e.target.value, 10);
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  return (
    <div>
      <div
        className={`grid grid-cols-2 xxs:grid-cols-2 ss:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-5 lg:gap-7 xxs:p-10 ${
          isPageChanging
            ? "opacity-0 transition-opacity duration-1000 ease-in-out" // Duración más larga y curva suave
            : "opacity-100 transition-opacity duration-1000 ease-in-out" // Transición suave
        }`}
      >
{visibleProducts
  .filter((product) => product.visible) // Filtrar solo los productos con `visible` igual a true
  .map((product) => (
    <ProductCard
      key={product.id}
      product={product}
      user={userData}
      loading={loading}
    />
  ))}
      </div>

      <div className="mt-6 flex flex-col items-center justify-center gap-4">
        <div className="flex items-center justify-center gap-6 mt-4 lg:flex-row lg:gap-8">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className={`p-3 transition-all duration-300 ease-in-out ${
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
            className={`p-3 transition-all duration-300 ease-in-out ${
              currentPage === totalPages
                ? "text-gray-400 cursor-not-allowed"
                : "text-red-500 hover:bg-gray-100"
            }`}
          >
            <ArrowIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center gap-4 text-gray-600 mt-4 lg:flex-row lg:gap-8">
          <span className="text-sm font-semibold">Mostrar</span>
          <select
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}
            className="border-2 border-gray-300 rounded-lg p-2 text-sm transition-all duration-300 ease-out focus:ring-2 focus:ring-red-500 focus:border-red-500 hover:bg-gray-100"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={30}>30</option>
            <option value={40}>40</option>
          </select>
        </div>
      </div>
    </div>
  );
}

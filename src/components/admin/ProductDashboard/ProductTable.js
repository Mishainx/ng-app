import { useProducts } from "@/context/ProductsContext";
import { capitalizeFirstLetter } from "@/utils/stringsManager";
import TrashIcon from "@/icons/TrashIcon";
import EditIcon from "@/icons/EditIcon";
import WrongIcon from "@/icons/WrongIcon";
import CheckIcon from "@/icons/CheckIcon";
import ArrowIcon from "@/icons/ArrowIcon";
import { useState, useEffect } from "react";
import Image from "next/image";

const ProductTable = ({
  handleViewChange,
  selectedCategory,
  selectedSubcategory,
  searchTerm,
}) => {
  const { products, deleteProduct } = useProducts();
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory
      ? product?.category === selectedCategory
      : true;
    const matchesSubcategory = selectedSubcategory
      ? Array.isArray(product?.subcategory) &&
        product?.subcategory?.includes(selectedSubcategory)
      : true;

    const matchesSearchTerm = searchTerm
      ? product && typeof product === "object"
        ? Object.keys(product).some((key) => {
            if (key === "img") return false;
            const value = product[key];
            return (
              typeof value === "string" &&
              value.toLowerCase().includes(searchTerm.toLowerCase())
            );
          })
        : false
      : true;

    return matchesCategory && matchesSubcategory && matchesSearchTerm;
  });

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, selectedSubcategory, searchTerm]);

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const goToPage = (page) => {
    setCurrentPage(Math.min(Math.max(page, 1), totalPages));
  };

  return (
    <div className="overflow-x-auto">
<div className="mb-3 flex flex-col sm:flex-row justify-between items-center text-sm space-y-2 sm:space-y-0">
  <p className="text-gray-600">
    {filteredProducts?.length}{" "}
    {filteredProducts?.length === 1
      ? "producto encontrado"
      : "productos encontrados"}
  </p>

  {totalPages > 1 && (
    <div className="flex items-center justify-center gap-4">
      <button
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage === 1}
        className={`p-2 transition-all duration-300 ease-in-out ${
          currentPage === 1
            ? "text-gray-400 cursor-not-allowed"
            : "text-red-500 hover:bg-gray-100"
        }`}
      >
        <ArrowIcon className="w-4 h-4 transform rotate-180" />
      </button>

      <span className="text-xs text-gray-500 font-semibold">
        Página {currentPage} de {totalPages}
      </span>

      <button
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`p-2 transition-all duration-300 ease-in-out ${
          currentPage === totalPages
            ? "text-gray-400 cursor-not-allowed"
            : "text-red-500 hover:bg-gray-100"
        }`}
      >
        <ArrowIcon className="w-4 h-4" />
      </button>
    </div>
  )}

  <div className="flex items-center">
    <label htmlFor="itemsPerPage" className="text-gray-500 text-xs mr-2">
      Mostrar:
    </label>
    <select
      id="itemsPerPage"
      value={itemsPerPage}
      onChange={handleItemsPerPageChange}
      className="border rounded px-2 py-1 text-xs"
    >
      <option value={10}>10</option>
      <option value={20}>20</option>
      <option value={50}>50</option>
    </select>
  </div>
</div>

      
      <table className="min-w-full bg-white border border-gray-200 text-xs rounded shadow">
        <thead>
          <tr className="bg-gray-100 border-b border-gray-200">
            <th className="py-1 px-2 text-center hidden md:table-cell">Imagen</th>
            <th className="py-1 px-2 text-center">SKU</th>
            <th className="py-1 px-2 text-center">Nombre</th>
            <th className="py-1 px-2 text-center">Precio</th>
            <th className="py-1 px-2 text-center">Descuento</th>
            <th className="py-1 px-2 text-center">Stock</th>
            <th className="py-1 px-2 hidden md:table-cell text-center">Destacado</th>
            <th className="py-1 px-2 hidden md:table-cell text-center">Visible</th>
            <th className="py-1 px-2 hidden md:table-cell text-center">Categoría</th>
            <th className="py-1 px-2 hidden md:table-cell text-center">Subcategoría</th>
            <th className="py-1 px-2 hidden md:table-cell text-center">Marca</th>
            <th className="py-1 px-2 text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          
          {paginatedProducts.map((product) => (
            <tr
              key={product.sku || "no-sku"}
              className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <td className="py-1 px-2 hidden md:table-cell text-center align-middle">
                {product.img ? (
                  <Image
                    src={product.img}
                    alt={product.name || "Imagen del producto"}
                    width={40}
                    height={40}
                    className="rounded shadow-sm"
                  />
                ) : (
                  <span>No disponible</span>
                )}
              </td>
              <td className="py-1 px-2 text-center align-middle">
                {product.sku || "Sin SKU"}
              </td>
              <td className="py-1 px-2 text-center align-middle">
                {capitalizeFirstLetter(product.name) || "Sin nombre"}
              </td>
              <td className="py-1 px-2 text-center align-middle">
                U$D {product.price ? Number(product.price).toFixed(2) : "0.00"}
              </td>
              <td className="py-1 px-2 text-center align-middle">
                {product.discount && product.discount > 0
                  ? `U$D ${Number(product.discount).toFixed(2)}`
                  : "-"}
              </td>
              <td className="py-1 px-2 text-center align-middle">
                {product.stock > 0 ? (
                  <CheckIcon className="w-4 h-4 text-green-500 mx-auto" />
                ) : (
                  <WrongIcon className="w-4 h-4 text-red-500 mx-auto" />
                )}
              </td>
              <td className="py-1 px-2 hidden md:table-cell text-center align-middle">
                {product.featured ? (
                  <CheckIcon className="w-4 h-4 text-green-500 mx-auto" />
                ) : (
                  <WrongIcon className="w-4 h-4 text-red-500 mx-auto" />
                )}
              </td>
              <td className="py-1 px-2 hidden md:table-cell text-center align-middle">
                {product.visible ? (
                  <CheckIcon className="w-4 h-4 text-green-500 mx-auto" />
                ) : (
                  <WrongIcon className="w-4 h-4 text-red-500 mx-auto" />
                )}
              </td>
              <td className="py-1 px-2 hidden md:table-cell text-center align-middle">
                {product.category
                  ? capitalizeFirstLetter(product.category)
                  : "-"}
              </td>
              <td className="py-1 px-2 hidden md:table-cell text-center align-middle">
                {product.subcategory?.length > 0
                  ? product.subcategory
                      .map((sub) => {
                        const prefix = `${product.category}-`;
                        const processedSub = sub.startsWith(prefix)
                          ? capitalizeFirstLetter(sub.replace(prefix, ""))
                          : capitalizeFirstLetter(sub);
                        return processedSub;
                      })
                      .join(", ")
                  : "-"}
              </td>
              <td className="py-1 px-2 hidden md:table-cell text-center align-middle">
                {typeof product.brand === "string" &&
                product.brand.trim() &&
                product.brand !== "null"
                  ? capitalizeFirstLetter(product.brand)
                  : "-"}
              </td>
              <td className="py-1 px-2 text-center flex justify-center space-x-2 align-middle md:table-cell">
                <button
                  onClick={() => handleViewChange("edit", product)}
                  className="text-yellow-500 hover:text-yellow-700 transition"
                >
                  <EditIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={() => deleteProduct(product.slug)}
                  className="text-red-500 hover:text-red-700 transition"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-3">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className={`p-2 transition-all duration-300 ease-in-out ${
              currentPage === 1
                ? "text-gray-400 cursor-not-allowed"
                : "text-red-500 hover:bg-gray-100"
            }`}
          >
            <ArrowIcon className="w-4 h-4 transform rotate-180" />
          </button>

          <span className="text-xs text-gray-500 font-semibold">
            Página {currentPage} de {totalPages}
          </span>

          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`p-2 transition-all duration-300 ease-in-out ${
              currentPage === totalPages
                ? "text-gray-400 cursor-not-allowed"
                : "text-red-500 hover:bg-gray-100"
            }`}
          >
            <ArrowIcon className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductTable;

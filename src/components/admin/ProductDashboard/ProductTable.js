import { useProducts } from "@/context/ProductsContext";
import { capitalizeFirstLetter } from "@/utils/stringsManager";
import TrashIcon from "@/icons/TrashIcon";
import EditIcon from "@/icons/EditIcon";
import WrongIcon from "@/icons/WrongIcon";
import CheckIcon from "@/icons/CheckIcon";
import ArrowIcon from "@/icons/ArrowIcon";
import { useState } from "react";
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
      ? Object.keys(product).some((key) => {
          if (key === "img") return false;
          const value = product[key];
          return (
            typeof value === "string" &&
            value.toLowerCase().includes(searchTerm.toLowerCase())
          );
        })
      : true;

    return matchesCategory && matchesSubcategory && matchesSearchTerm;
  });

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page
  };

  const goToPage = (page) => {
    setCurrentPage(Math.min(Math.max(page, 1), totalPages));
  };

  return (
    <div className="overflow-x-auto">
      <div className="mb-4 flex justify-between items-center">
        <p className="text-gray-700">
          {filteredProducts?.length}{" "}
          {filteredProducts?.length === 1
            ? "producto encontrado"
            : "productos encontrados"}
        </p>
        <select
          value={itemsPerPage}
          onChange={handleItemsPerPageChange}
          className="border rounded-md px-2 py-1 text-sm"
        >
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>
      </div>
      <table className="min-w-full bg-white border border-gray-300 text-sm rounded-md shadow-md">
        <thead>
          <tr className="bg-gray-100 border-b border-gray-300">
            <th className="py-2 px-3 text-center hidden md:table-cell">Imagen</th>
            <th className="py-2 px-3 text-center">SKU</th>
            <th className="py-2 px-3 text-center">Nombre</th>
            <th className="py-2 px-3 text-center">Precio</th>
            <th className="py-2 px-3 text-center">Descuento</th>
            <th className="py-2 px-3 text-center">Stock</th>
            <th className="py-2 px-3 hidden md:table-cell text-center">Destacado</th>
            <th className="py-2 px-3 hidden md:table-cell text-center">Visible</th>
            <th className="py-2 px-3 hidden md:table-cell text-center">Categoría</th>
            <th className="py-2 px-3 hidden md:table-cell text-center">
              Subcategoría
            </th>
            <th className="py-2 px-3 hidden md:table-cell text-center">Marca</th>
            <th className="py-2 px-3 text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {paginatedProducts.map((product) => (
            <tr
              key={product.sku || "no-sku"}
              className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <td className="py-2 px-3 hidden md:table-cell text-center align-middle">
                {product.img ? (
                  <Image
                    src={product.img}
                    alt={product.name || "Imagen del producto"}
                    width={50}
                    height={50}
                    className="rounded-md shadow-sm"
                  />
                ) : (
                  <span>No disponible</span>
                )}
              </td>
              <td className="py-2 px-3 text-center align-middle">
                {product.sku || "Sin SKU"}
              </td>
              <td className="py-2 px-3 text-center align-middle">
                {capitalizeFirstLetter(product.name) || "Sin nombre"}
              </td>
              <td className="py-2 px-3 text-center align-middle whitespace-nowrap">
                U$D {product.price ? Number(product.price).toFixed(2) : "0.00"}
              </td>
              <td className="py-2 px-3 text-center align-middle">
                {product.discount && product.discount > 0
                  ? `U$D ${Number(product.discount).toFixed(2)}`
                  : "-"}
              </td>
              <td className="py-2 px-3 text-center align-middle">
                {product.stock > 0 ? (
                  <CheckIcon className="w-6 h-6 text-green-500 mx-auto" />
                ) : (
                  <WrongIcon className="w-4 h-4 text-red-500 mx-auto" />
                )}
              </td>
              <td className="py-2 px-3 hidden md:table-cell text-center align-middle">
                {product.featured ? (
                  <CheckIcon className="w-6 h-6 text-green-500 mx-auto" />
                ) : (
                  <WrongIcon className="w-4 h-4 text-red-500 mx-auto" />
                )}
              </td>
              <td className="py-2 px-3 hidden md:table-cell text-center align-middle">
                {product.visible ? (
                  <CheckIcon className="w-6 h-6 text-green-500 mx-auto" />
                ) : (
                  <WrongIcon className="w-4 h-4 text-red-500 mx-auto" />
                )}
              </td>
              <td className="py-2 px-3 hidden md:table-cell text-center align-middle">
                {product.category
                  ? capitalizeFirstLetter(product.category)
                  : "-"}
              </td>
              <td className="py-2 px-3 hidden md:table-cell text-center align-middle">
                {product.subcategory?.length > 0
                  ? product.subcategory
                      .map((sub) =>
                        capitalizeFirstLetter(
                          sub.replace(`${product.category}-`, "")
                        )
                      )
                      .join(", ")
                  : "-"}
              </td>
              <td className="py-2 px-3 hidden md:table-cell text-center align-middle">
                {product.brand ? capitalizeFirstLetter(product.brand) : "-"}
              </td>
              <td className="py-2 px-3 text-center align-middle flex justify-center space-x-2">
                <button
                  onClick={() => handleViewChange("edit", product)}
                  className="text-yellow-500 hover:text-yellow-700 transition"
                >
                  <EditIcon className="w-5 h-5" />
                </button>
                <button
                  onClick={() => deleteProduct(product.slug)}
                  className="text-red-500 hover:text-red-700 transition"
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Paginación */}
      {totalPages > 1 && (
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

          <span className="text-sm text-gray-500 font-semibold">
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
      )}
    </div>
  );
};

export default ProductTable;

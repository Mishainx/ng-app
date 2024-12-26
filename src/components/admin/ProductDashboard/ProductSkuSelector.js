import { useState, useEffect } from "react";
import { useProducts } from "@/context/ProductsContext";
import { capitalizeFirstLetter } from "@/utils/stringsManager";
import PlusIcon from "@/icons/PlusIcon";
import TrashIcon from "@/icons/TrashIcon";
import { toast } from "react-toastify";

const ProductSkuSelector = ({ selectedSkus = [], setSelectedSkus }) => {
  const { products } = useProducts();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredProducts([]);
      return;
    }

    const filtered = products.filter((product) => {
      const search = searchTerm.toLowerCase();
      return (
        product.name.toLowerCase().includes(search) ||
        product.sku.toLowerCase().includes(search)
      );
    });

    setFilteredProducts(filtered);
  }, [searchTerm, products]);

  const handleAddSku = (sku) => {
    if (!selectedSkus.includes(sku)) {
      setSelectedSkus([...selectedSkus, sku]); // Agregar el SKU
    } else {
      toast.error("El producto ya está en la lista.");
    }
    setSearchTerm(""); // Limpiar el input después de agregar
    setFilteredProducts([]); // Limpiar la lista de sugerencias
  };

  const handleRemoveSku = (sku) => {
    setSelectedSkus(selectedSkus.filter((item) => item !== sku)); // Remover el SKU
    toast.info("Producto eliminado de la lista.");
  };

  return (
    <div className="mb-4">
      <label className="text-sm text-gray-700">Productos Relacionados</label>
      <input
        type="text"
        className="border rounded w-full py-1 px-2"
        placeholder="Buscar por nombre, SKU o categoría"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {/* Sugerencias */}
      {filteredProducts.length > 0 && (
        <div className="border mt-2 rounded bg-white shadow-md max-h-48 overflow-y-auto">
          {filteredProducts.map((product) => (
            <div
              key={product.sku}
              className="p-2 hover:bg-gray-100 cursor-pointer flex justify-between"
              onClick={() => handleAddSku(product.sku)}
            >
              <span>
                {capitalizeFirstLetter(product.name)} - {product.sku}
              </span>
              <span className="text-gray-500 text-sm">
                {capitalizeFirstLetter(product.category)}
              </span>
            </div>
          ))}
        </div>
      )}
      {/* Lista de SKUs seleccionados */}
      <div className="mt-3 flex flex-wrap gap-2">
        {selectedSkus.map((sku) => (
          <span
            key={sku}
            className="flex items-center px-3 py-1 bg-gray-200 text-gray-800 rounded-full"
          >
            {sku}
            <button
              type="button"
              className="ml-2 text-red-500 hover:text-red-700"
              onClick={() => handleRemoveSku(sku)}
            >
              ✕
            </button>
          </span>
        ))}
      </div>
    </div>
  );
};

export default ProductSkuSelector;

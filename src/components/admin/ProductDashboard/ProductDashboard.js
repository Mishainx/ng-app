import { useState } from "react";
import CreateProductForm from "./CreateProductForm";
import EditProductForm from "./EditProductForm";
import ProductTable from "./ProductTable";
import { useCategories } from "@/context/CategoriesContext";
import { capitalizeFirstLetter } from "@/utils/stringsManager";

const ProductDashboard = () => {
  const [view, setView] = useState("list");
  const [editingProduct, setEditingProduct] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const { categories } = useCategories();

  const handleViewChange = (newView, product = null) => {
    setEditingProduct(product);
    setView(newView);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value); // Actualiza el término de búsqueda directamente
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Panel de Administración de Productos</h1>

      {view === "list" ? (
        <>
          <button
            onClick={() => handleViewChange("create")}
            className="bg-blue-500 text-white px-4 py-2 mb-4"
          >
            Crear Producto
          </button>

          <div className="flex flex-wrap gap-4 mb-4">
            <div>
              <label className="block text-gray-700 mb-2">Filtrar por Categoría:</label>
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setSelectedSubcategory(""); // Resetear subcategoría al cambiar categoría
                }}
                className="border rounded w-full py-2 px-3"
              >
                <option value="">Todas las categorías</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.slug}>
                    {capitalizeFirstLetter(category.title)}
                  </option>
                ))}
              </select>
            </div>

            {selectedCategory && categories.find(cat => cat.slug === selectedCategory)?.subcategories?.length > 0 && (
              <div>
                <label className="block text-gray-700 mb-2">Filtrar por Subcategoría:</label>
                <select
                  value={selectedSubcategory}
                  onChange={(e) => setSelectedSubcategory(e.target.value)}
                  className="border rounded w-full py-2 px-3"
                >
                  <option value="">Todas las subcategorías</option>
                  {categories
                    .find((category) => category.slug === selectedCategory)
                    .subcategories.map((subcategory) => (
                      <option key={subcategory.slug} value={subcategory.slug}>
                        {capitalizeFirstLetter(subcategory.title)}
                      </option>
                    ))}
                </select>
              </div>
            )}

            <div>
              <label className="block text-gray-700 mb-2">Buscar Productos:</label>
              <input
                type="text"
                placeholder="Buscar producto"
                value={searchTerm}
                onChange={handleSearchChange}
                className="border rounded w-full py-2 px-3"
              />
            </div>
          </div>

          <ProductTable
            handleViewChange={handleViewChange}
            selectedCategory={selectedCategory}
            selectedSubcategory={selectedSubcategory}
            searchTerm={searchTerm}
          />
        </>
      ) : view === "create" ? (
        <CreateProductForm setView={setView} />
      ) : (
        <EditProductForm
          editingProduct={editingProduct}
          setView={setView}
        />
      )}
    </div>
  );
};

export default ProductDashboard;

import { useState, useEffect } from "react";
import CreateProductForm from "./CreateProductForm";
import EditProductForm from "./EditProductForm";
import ProductTable from "./ProductTable";
import { useCategories } from "@/context/CategoriesContext";
import { capitalizeFirstLetter } from "@/utils/stringsManager";

const ProductDashboard = ({ resetView }) => {
  const [view, setView] = useState(`list`);
  const [editingProduct, setEditingProduct] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const { categories } = useCategories();

  useEffect(() => {
    setView("list");
  }, [resetView]);

  const handleViewChange = (newView, product = null) => {
    setEditingProduct(product);
    setView(newView);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="container mx-auto p-3">
      <h1 className="text-1xl font-bold mb-2">Panel de Productos</h1>

      {view === "list" ? (
        <>
          <button
            onClick={() => handleViewChange("create")}
            className="bg-red-500 text-white px-3 py-2 mb-3 text-sm rounded shadow hover:bg-red-600 transition"
          >
            Crear Producto
          </button>

          <div className="flex flex-wrap gap-3 mb-3">
            <div>

              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setSelectedSubcategory("");
                }}
                className="border rounded py-1 px-2 text-sm"
              >
                <option value="">Todas las categorías</option>
                {categories.map((category) => (
                  <option key={category.id} value={category?.slug}>
                    {capitalizeFirstLetter(category.title)}
                  </option>
                ))}
              </select>
            </div>

            {selectedCategory &&
              categories.find((cat) => cat.slug === selectedCategory)?.subcategories?.length > 0 && (
                <div>

                  <select
                    value={selectedSubcategory}
                    onChange={(e) => setSelectedSubcategory(e.target.value)}
                    className="border rounded py-1 px-2 text-sm"
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
              <input
                type="text"
                placeholder="Buscar producto"
                value={searchTerm}
                onChange={handleSearchChange}
                className="border rounded py-1 px-2 text-sm w-full"
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
        <EditProductForm editingProduct={editingProduct} setView={setView} />
      )}
    </div>
  );
};

export default ProductDashboard;

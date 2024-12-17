"use client";

import { useState, useEffect } from "react";
import { useCategories } from "@/context/CategoriesContext";
import AddCategoryForm from "./AddCategoryForm";
import CategoryTable from "./CategoryTable";
import SubcategoriesView from "./SubcategoriesView/SubcategoriesView";

const CategoriesDashboard = ({ resetView }) => {
  const { categories, updateCategory, deleteCategory } = useCategories();
  const [view, setView] = useState("list"); // 'list', 'createForm', 'subcategories'
  const [selectedCategory, setSelectedCategory] = useState(null);

  const toggleView = () => {
    setView((prevView) => (prevView === "list" ? "createForm" : "list"));
  };

  const handleCategoryCreated = () => {
    setView("list");
  };

  const handleViewSubcategories = (category) => {
    setSelectedCategory(category); // Guardar la categoría seleccionada
    setView("subcategories"); // Cambiar a la vista de subcategorías
  };

  const handleBackToCategories = () => {
    setSelectedCategory(null);
    setView("list");
  };

  useEffect(() => {
    setView("list");
  }, [resetView]);

  return (
    <div className="container mx-auto p-4 max-w-5xl">
      <h1 className="text-1xl font-bold mb-4 text-gray-800 text-start">
        {view === "subcategories" ? "Administración de Subcategorías" : "Administración de Categorías"}
      </h1>

      {/* Botón para alternar entre vistas */}
      {view !== "subcategories" && (
        <button
          onClick={toggleView}
          className="bg-red-500 text-white px-4 py-2 rounded-md mb-4 hover:bg-red-600 transition-all w-full sm:w-auto"
        >
          {view === "createForm" ? "Volver a la Lista" : "Agregar Categoría"}
        </button>
      )}

      {/* Renderizar vistas */}
      {view === "createForm" ? (
        <div className="bg-gray-50 p-4 rounded-lg shadow-md">
          <AddCategoryForm resetView={resetView} onCategoryCreated={handleCategoryCreated} />
        </div>
      ) : view === "subcategories" ? (
        <SubcategoriesView category={selectedCategory} onBack={handleBackToCategories} />
      ) : (
        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
          <CategoryTable
            categories={categories}
            updateCategory={updateCategory}
            deleteCategory={deleteCategory}
            onViewSubcategories={handleViewSubcategories} // Nueva prop para manejar subcategorías
          />
        </div>
      )}
    </div>
  );
};

export default CategoriesDashboard;

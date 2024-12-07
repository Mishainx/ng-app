"use client";

import { useState } from "react";
import { useCategories } from "@/context/CategoriesContext";
import AddCategoryForm from "./AddCategoryForm";
import CategoryTable from "./CategoryTable";

const CategoriesDashboard = () => {
  const { categories, updateCategory, deleteCategory } = useCategories();
  const [isAddingCategory, setIsAddingCategory] = useState(false); // Estado para alternar vistas

  const toggleView = () => setIsAddingCategory(!isAddingCategory);

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <h1 className="text-4xl font-bold mb-8 text-gray-800 text-center md:text-left">Administración de Categorías</h1>

      {/* Botón para alternar entre vistas */}
      <button
        onClick={toggleView}
        className="bg-red-500 text-white px-6 py-3 rounded-lg mb-6 hover:bg-red-600 transition-all w-full sm:w-auto"
      >
        {isAddingCategory ? "Volver a la Lista" : "Agregar Categoría"}
      </button>

      {/* Alternar entre el formulario y la tabla */}
      {isAddingCategory ? (
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 rounded-xl shadow-lg">
          <AddCategoryForm/>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white shadow-lg rounded-xl">
          <CategoryTable
            categories={categories}
            updateCategory={updateCategory}
            deleteCategory={deleteCategory}
          />
        </div>
      )}
    </div>
  );
};

export default CategoriesDashboard;

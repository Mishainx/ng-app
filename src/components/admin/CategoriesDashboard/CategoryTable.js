import { useState } from 'react';
import CategoryRow from './CategoryRow';

const CategoryTable = ({ categories, updateCategory, deleteCategory, onViewSubcategories  }) => {
  // Estado para la página actual
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Calcular el índice de inicio y fin de las categorías para la página actual
  const indexOfLastCategory = currentPage * itemsPerPage;
  const indexOfFirstCategory = indexOfLastCategory - itemsPerPage;
  const currentCategories = categories.slice(indexOfFirstCategory, indexOfLastCategory);

  // Función para cambiar la página
  const changePage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Calcular el número total de páginas
  const totalPages = Math.ceil(categories.length / itemsPerPage);

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg overflow-hidden">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Nombre</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 hidden sm:table-cell">Imagen</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 hidden sm:table-cell">Icono</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Visible</th>
            <th className="px-4 py-3 text-center text-sm font-semibold text-gray-600">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {currentCategories.map((category) => (
            <CategoryRow
              key={category?.id}
              category={category}
              updateCategory={updateCategory}
              deleteCategory={deleteCategory}
              onViewSubcategories={onViewSubcategories} // Pasar la función

            />
          ))}
        </tbody>
      </table>

      {/* Paginación */}
      {categories?.length > itemsPerPage && (
        <div className="mt-4 flex justify-between items-center">
          <p className="text-sm text-gray-700">
            Página {currentPage} de {totalPages || 1}
          </p>
          <div className="flex space-x-2 text-xs">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              className="bg-gray-200 text-gray-700 rounded-md px-4 py-2 hover:bg-gray-300 transition"
              disabled={currentPage === 1}
            >
              Anterior
            </button>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              className="bg-gray-200 text-gray-700 rounded-md px-4 py-2 hover:bg-gray-300 transition"
              disabled={currentPage === totalPages}
            >
              Siguiente
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryTable;



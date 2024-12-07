import { useState } from "react";
import Image from "next/image";
import EditIcon from "@/icons/EditIcon";
import TrashIcon from "@/icons/TrashIcon";
import EyeIcon from "@/icons/EyeIcon";
import { capitalizeFirstLetter } from "@/utils/stringsManager";

const CategoryRow = ({ category, updateCategory, deleteCategory }) => {
  // Estado para controlar si la categoría está expandida
  const [isExpanded, setIsExpanded] = useState(false);

  // Función para manejar el clic en la categoría y expandirla
  const handleCategoryClick = () => {
    setIsExpanded(!isExpanded); // Cambiar el estado de expansión
  };

  return (
    <>
      <tr className="hover:bg-gray-50 cursor-pointer">
        {/* Título */}
        <td className="px-4 py-3 font-medium text-gray-700" onClick={handleCategoryClick}>
          {capitalizeFirstLetter(category.title)}
        </td>

        {/* Imagen principal (rectangular) */}
        <td className="px-4 py-3 hidden sm:table-cell">
          {category.img ? (
            <div className="w-20 h-15 rounded overflow-hidden border border-gray-200">
              <Image
                src={category.img}
                alt={category.title}
                width={80}
                height={60} // Proporción 4:3
                className="object-cover"
              />
            </div>
          ) : (
            <div className="w-20 h-15 bg-gray-200 rounded flex items-center justify-center text-gray-500">
              N/A
            </div>
          )}
        </td>

        {/* Miniatura de ícono (circular) */}
        <td className="px-4 py-3 hidden sm:table-cell">
          {category.icon ? (
            <div className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center bg-gray-50">
              <Image
                src={category.icon}
                alt={`${category.title} icon`}
                width={24}
                height={24}
                className="object-contain"
              />
            </div>
          ) : (
            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
              N/A
            </div>
          )}
        </td>

        {/* Mostrar en menú */}
        <td className="px-4 py-3 text-center">
          <EyeIcon
            className={`w-6 h-6 ${
              category.showInMenu ? "text-green-500" : "text-red-500"
            }`}
          />
        </td>

        {/* Acciones */}
        <td className="px-4 py-3 flex justify-center gap-4">
          <button className="text-yellow-500 hover:text-yellow-600">
            <EditIcon />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation(); // Evita que el click en el botón haga algo no deseado
              deleteCategory(category.id);
            }}
            className="text-red-500 hover:text-red-600"
          >
            <TrashIcon />
          </button>
        </td>
      </tr>

      {/* Subcategorías (se muestra solo si la categoría está expandida) */}
      {isExpanded && category.subcategories && category.subcategories.length > 0 && (
        <tr>
          <td colSpan="5" className="pl-12 py-4">
            <div>
              <h3 className="font-medium text-lg text-gray-800">Subcategorías</h3>
              <ul className="space-y-2 mt-2">
                {category.subcategories.map((subcat) => (
                  <li key={subcat.id} className="text-gray-600">
                    {capitalizeFirstLetter(subcat.title)}
                  </li>
                ))}
              </ul>
            </div>
          </td>
        </tr>
      )}
    </>
  );
};

export default CategoryRow;

import { useState } from "react";
import Image from "next/image";
import EditIcon from "@/icons/EditIcon";
import TrashIcon from "@/icons/TrashIcon";
import SpinnerIcon from "@/icons/SpinnerIcon";
import EyeIcon from "@/icons/EyeIcon";
import { capitalizeFirstLetter } from "@/utils/stringsManager";
import { toast } from "react-toastify";
import EditCategoryForm from "./EditCategoryForm"; // Componente del formulario de edición

const CategoryRow = ({ category, updateCategory, deleteCategory, onViewSubcategories }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // Estado para mostrar el formulario de edición
  // Maneja el click en la categoría para expandir o contraer subcategorías
  const handleCategoryClick = () => {
    setIsExpanded(!isExpanded);
  };

  // Maneja la apertura del formulario de edición
  const handleEdit = (e) => {
    e.stopPropagation();
    setIsEditing(true); // Abrir el formulario de edición
  };

  // Maneja la eliminación de la categoría
  const handleDelete = async (e) => {
    e.stopPropagation();
    setIsDeleting(true); // Muestra el spinner de carga
    try {
      await deleteCategory(category.slug); // Llama a la función para eliminar
      toast.success("Categoría eliminada exitosamente.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    } catch (error) {
      console.error("Error eliminando categoría:", error);
      toast.error("Hubo un error al eliminar la categoría. Intenta nuevamente.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    } finally {
      setIsDeleting(false); // Oculta el spinner
    }
  };

  // Cierra el formulario de edición
  const handleCloseEditForm = () => {
    setIsEditing(false); // Cerrar el formulario de edición
  };

  return (
    <>
      <tr className="hover:bg-gray-100 cursor-pointer items-center justify-center">
        <td className="px-3 py-2 text-sm font-medium text-gray-700" onClick={handleCategoryClick}>
          {capitalizeFirstLetter(category?.title)}
        </td>

{/* Imagen de la categoría */}
<td className="px-3 py-2 hidden sm:table-cell">
  {category?.img ? (
    <div className="w-16 h-12 rounded border overflow-hidden flex items-center justify-center">
      <Image
        src={category?.img}
        alt={category?.title}
        width={64}
        height={48}
        className="object-cover w-full h-full"
      />
    </div>
  ) : (
    <div className="w-16 h-12 bg-transparent flex items-center justify-center text-xs text-gray-500">
      N/A
    </div>
  )}
</td>


        {/* Icono de la categoría */}
        <td className="px-3 py-2 hidden sm:table-cell">
          {category?.icon ? (
            <div className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center bg-gray-50">
              <Image
                src={category?.icon}
                alt={`${category?.title} icon`}
                width={20}
                height={20}
                className="object-contain"
              />
            </div>
          ) : (
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-xs text-gray-500">
              N/A
            </div>
          )}
        </td>

        {/* Icono de visibilidad */}
        <td className="px-3 py-2 text-center">
          <EyeIcon
            className={`w-5 h-5 ${
              category?.showInMenu ? "text-green-500" : "text-red-500"
            }`}
          />
        </td>




        {/* Botones de subcategorias, editar y eliminar */}
        <td className="px-3 py-2 text-center align-middle">
  <div className="flex items-center justify-center gap-3">
    {/* Botón para ver subcategorías */}
    <button
      onClick={() => onViewSubcategories(category)}
      className="text-blue-500 hover:text-blue-600 flex items-center justify-center"
    >
      <EyeIcon className="h-5 w-5" />
    </button>

    {/* Botón de Editar */}
    <button
      onClick={handleEdit}
      className="text-yellow-500 hover:text-yellow-600 flex items-center justify-center"
    >
      <EditIcon className="h-5 w-5" />
    </button>

    {/* Botón de Eliminar */}
    <button
      onClick={handleDelete}
      className="text-red-500 hover:text-red-600 flex items-center justify-center"
      disabled={isDeleting}
    >
      {isDeleting ? (
        <SpinnerIcon className="w-5 h-5 animate-spin" />
      ) : (
        <TrashIcon className="h-5 w-5" />
      )}
    </button>
  </div>
</td>
      </tr>



      {/* Mostrar el formulario de edición si está activado */}
      {isEditing && <EditCategoryForm category={category} onClose={handleCloseEditForm} />}
    </>
  );
};

export default CategoryRow;

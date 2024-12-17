import { useState } from "react";
import { toast } from "react-toastify";
import EditIcon from "@/icons/EditIcon";
import TrashIcon from "@/icons/TrashIcon";
import SpinnerIcon from "@/icons/SpinnerIcon";
import AddSubcategoryForm from "./AddSubcategoryForm";
import { capitalizeFirstLetter } from "@/utils/stringsManager";
import { useCategories } from "@/context/CategoriesContext";
import EditSubcategoryForm from "./EditSubcategoryForm";
import Image from "next/image";

const SubcategoriesView = ({ category, onBack }) => {
  const [subcategories, setSubcategories] = useState(category?.subcategories || []);
  const [isAdding, setIsAdding] = useState(false);
  const [editingSubcategory, setEditingSubcategory] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const { addSubcategory, deleteSubcategory, updateSubcategory } = useCategories();

  // Filtrar subcategorías
  const filteredSubcategories = subcategories.filter((sub) =>
    sub?.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredSubcategories.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredSubcategories.length / itemsPerPage);

  // Crear Subcategoría
  const handleAddSubcategory = async (formData) => {
    try {
      const response = await addSubcategory(category.slug, formData);
      if (response.status === "success") {
        setSubcategories((prevSubcategories) => [
          ...prevSubcategories,
          response.subcategory,
        ]);
        toast.success("Subcategoría agregada exitosamente.");
        setIsAdding(false); // Cerrar el modal
      } else {
        toast.error(response.message || "Error al agregar la subcategoría");
      }
    } catch (error) {
      toast.error(error.message || "Error al agregar la subcategoría");
    }
  };

  // Eliminar Subcategoría
  const handleDeleteSubcategory = async (subcategorySlug) => {
    setDeletingId(subcategorySlug);
    try {
      await deleteSubcategory(category.slug, subcategorySlug);
      setSubcategories((prevSubcategories) =>
        prevSubcategories.filter((sub) => sub.slug !== subcategorySlug)
      );
      toast.success("Subcategoría eliminada correctamente.");
    } catch (error) {
      toast.error("Error al eliminar la subcategoría.");
    } finally {
      setDeletingId(null);
    }
  };

  // Manejar la edición de una subcategoría
  const handleEditSubcategory = async (slug, formData) => {
    try {
      const response = await updateSubcategory(category.slug, slug, formData);
      if (response.status === "success") {
        setSubcategories((prev) =>
          prev.map((sub) =>
            sub.slug === slug ? { ...sub, ...response.subcategory } : sub
          )
        );
      } else {
        toast.error("Error al actualizar subcategoría.");
      }
    } catch (error) {
      toast.error("Error al actualizar subcategoría.");
    } finally {
      setEditingSubcategory(null);
    }
  };

  // Cambiar página
  const handlePageChange = (page) => setCurrentPage(page);

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg overflow-hidden">
      <button
        onClick={onBack}
        className="bg-gray-500 text-white px-2 py-1 rounded-md mb-4 hover:bg-gray-600 transition-all"
      >
        Volver a Categorías
      </button>

      <h2 className="text-lg font-bold mb-4">Subcategorías de {category?.title}</h2>

      {/* Buscador */}
      <input
        type="text"
        placeholder="Buscar subcategoría..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full p-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      <button
        onClick={() => setIsAdding(true)}
        className="bg-red-500 text-white text-sm sm:text-base px-3 py-1 rounded-md mb-4 hover:bg-red-600 transition-all"
      >
        Agregar Subcategoría
      </button>

      {/* Modal para agregar subcategoría */}
      {isAdding && (
        <AddSubcategoryForm
          onAddSubcategory={handleAddSubcategory}
          onCancel={() => setIsAdding(false)}
        />
      )}

      {editingSubcategory && (
        <EditSubcategoryForm
          subcategory={editingSubcategory}
          onEditSubcategory={handleEditSubcategory}
          onCancel={() => setEditingSubcategory(null)}
        />
      )}

      {/* Tabla de subcategorías */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Título</th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-gray-600">Icono</th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-gray-600">Imagen</th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-gray-600">Mostrar en Menú</th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-gray-600">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((sub) => (
              <tr key={sub.slug} className="hover:bg-gray-50">
                <td className="px-4 py-2 text-sm sm:text-base">{capitalizeFirstLetter(sub.title)}</td>

                {/* Icono */}
                <td className="px-4 py-2 text-center">
                  {sub?.icon ? (
                    <Image
                      src={sub.icon} // Asegúrate de que sub.icon no sea null ni undefined
                      alt="icon"
                      width={48}
                      height={48}
                      className="mx-auto object-cover rounded"
                    />
                  ) : (
                    <span>-</span> // Mostrar guion si no hay icono
                  )}
                </td>

                {/* Imagen */}
                <td className="px-4 py-2 text-center">
                  {sub?.img && sub?.img !== 'null' ? (
                    <Image
                      src={sub.img} // Asegúrate de que sub.img no sea null ni undefined
                      alt="img"
                      width={48}
                      height={32}
                      className="mx-auto object-cover rounded"
                    />
                  ) : (
                    <span>-</span> // Mostrar guion si no hay imagen
                  )}
                </td>

                <td className="px-4 py-2 text-center text-sm sm:text-base">{sub.showInMenu ? "Sí" : "No"}</td>

                {/* Acciones */}
                <td className="px-4 py-2 flex items-center justify-center gap-2">
                  <button onClick={() => setEditingSubcategory(sub)} className="text-yellow-500 hover:text-yellow-600 text-sm sm:text-base">
                    <EditIcon className="w-5 h-5" />
                  </button>

                  <button
                    onClick={() => handleDeleteSubcategory(sub.slug)}
                    disabled={deletingId === sub.id}
                    className="text-red-500 hover:text-red-600 text-sm sm:text-base"
                  >
                    {deletingId === sub.id ? <SpinnerIcon className="w-5 h-5 animate-spin" /> : <TrashIcon className="w-5 h-5" />}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      {filteredSubcategories.length > itemsPerPage && (
        <div className="mt-4 flex justify-between items-center">
          <p className="text-sm text-gray-700">Página {currentPage} de {totalPages || 1}</p>
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

export default SubcategoriesView;

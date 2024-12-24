import { useState} from "react";
import { toast } from "react-toastify";
import { useCategories } from "@/context/CategoriesContext";
import SpinnerIcon from "@/icons/SpinnerIcon";

const EditCategoryForm = ({ category, onClose }) => {
  const [title, setTitle] = useState(category?.title || "");
  const [description, setDescription] = useState(category?.description || ""); // Nuevo campo
  const [imgFile, setImgFile] = useState(null);
  const [iconFile, setIconFile] = useState(null);
  const [showInMenu, setShowInMenu] = useState(category?.showInMenu || "false");
  const [loading, setLoading] = useState(false);

  const { updateCategory } = useCategories();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const updatedData = {
      title,
      description,
      img: imgFile,
      icon: iconFile,
      showInMenu: showInMenu,
    };

    try {
      const updatedCategory = await updateCategory(category.slug, updatedData);
      toast.success("Categoría actualizada exitosamente");
      onClose(); // Cerrar el formulario
    } catch (error) {
      toast.error("Error al actualizar la categoría. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg mx-auto">
        <h2 className="text-xl font-semibold mb-4">Editar Categoría</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">Título</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-red-500"
            />
          </div>

          {/* Campo para descripción */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Descripción</label>
            <textarea
              id="description"
              value={description}
              maxLength={100} // Restricción de longitud
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-red-500"
              rows="3"
            />
            <p className="text-sm text-gray-500 mt-1">{100 - description.length} caracteres restantes</p>
          </div>

          <div>
            <label htmlFor="img" className="block text-sm font-medium text-gray-700">Imagen</label>
            <input
              type="file"
              id="img"
              accept="image/jpeg, image/png"
              onChange={(e) => setImgFile(e.target.files[0])}
              className="w-full px-2 py-1 border border-gray-300 rounded"
            />
          </div>

          <div>
            <label htmlFor="icon" className="block text-sm font-medium text-gray-700">Ícono</label>
            <input
              type="file"
              id="icon"
              accept="image/jpeg, image/png"
              onChange={(e) => setIconFile(e.target.files[0])}
              className="w-full px-2 py-1 border border-gray-300 rounded"
            />
          </div>

          <div>
            <label htmlFor="showInMenu" className="block text-sm font-medium text-gray-700">Mostrar en Menú</label>
            <select
              id="showInMenu"
              value={showInMenu}
              onChange={(e) => setShowInMenu(e.target.value)}
              className="w-full px-2 py-1 border border-gray-300 rounded"
            >
              <option value="true">Sí</option>
              <option value="false">No</option>
            </select>
          </div>

          <div className="mt-4 flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400">
              Cancelar
            </button>
            <button
              type="submit"
              className={`px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 ${loading ? 'opacity-50' : ''}`}
              disabled={loading}
            >
              {loading ? <SpinnerIcon className="w-5 h-5 animate-spin" /> : "Actualizar Categoría"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCategoryForm;

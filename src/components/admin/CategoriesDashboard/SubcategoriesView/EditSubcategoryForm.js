import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import SpinnerIcon from "@/icons/SpinnerIcon";

const EditSubcategoryForm = ({ subcategory, onEditSubcategory, onCancel }) => {
  const [title, setTitle] = useState(subcategory.title || "");
  const [imgFile, setImgFile] = useState(null);
  const [iconFile, setIconFile] = useState(null);
  const [showInMenu, setShowInMenu] = useState(
    subcategory.showInMenu ? "true" : "false"
  );
  const [loading, setLoading] = useState(false);

  // Pre-cargar valores cuando subcategory cambia
  useEffect(() => {
    setTitle(subcategory.title || "");
    setShowInMenu(subcategory.showInMenu ? "true" : "false");
    setImgFile(null);
    setIconFile(null);
  }, [subcategory]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('img', imgFile);
    formData.append('icon', iconFile);
    formData.append('showInMenu', showInMenu);


    try {

      await onEditSubcategory(subcategory.slug, formData); // Función pasada como prop
      toast.success("Subcategoría editada exitosamente.");
    } catch (error) {
      toast.error("Error al editar la subcategoría.");
    } finally {
      setLoading(false);
      onCancel(); // Cerrar modal
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 space-y-4">
        <h2 className="text-lg font-semibold mb-4">Editar Subcategoría</h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Título */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Título
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-red-500"
              required
            />
          </div>

          {/* Imagen */}
          <div>
            <label htmlFor="img" className="block text-sm font-medium text-gray-700">
              Nueva Imagen
            </label>
            <input
              type="file"
              id="img"
              name="img"
              accept="image/jpeg, image/png"
              onChange={(e) => setImgFile(e.target.files[0])}
              className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-red-500"
            />
          </div>

          {/* Icono */}
          <div>
            <label htmlFor="icon" className="block text-sm font-medium text-gray-700">
              Nuevo Ícono
            </label>
            <input
              type="file"
              id="icon"
              name="icon"
              accept="image/jpeg, image/png"
              onChange={(e) => setIconFile(e.target.files[0])}
              className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-red-500"
            />
          </div>

          {/* Mostrar en Menú */}
          <div>
            <label htmlFor="showInMenu" className="block text-sm font-medium text-gray-700">
              Mostrar en Menú
            </label>
            <select
              id="showInMenu"
              name="showInMenu"
              value={showInMenu}
              onChange={(e) => setShowInMenu(e.target.value)}
              className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-red-500"
            >
              <option value="true">Sí</option>
              <option value="false">No</option>
            </select>
          </div>

          {/* Botones */}
          <div className="flex gap-2">
            <button
              type="submit"
              className={`w-full px-3 py-1 bg-red-500 text-white text-sm rounded flex items-center justify-center ${
                loading ? "opacity-50" : ""
              } hover:bg-red-600`}
              disabled={loading}
            >
              {loading ? <SpinnerIcon className="w-5 h-5 animate-spin" /> : "Guardar Cambios"}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="w-full px-3 py-1 bg-gray-400 text-white text-sm rounded flex items-center justify-center hover:bg-gray-500"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditSubcategoryForm;

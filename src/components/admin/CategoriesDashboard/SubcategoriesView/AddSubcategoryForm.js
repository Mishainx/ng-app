import { useState } from "react";
import { toast } from "react-toastify";
import SpinnerIcon from "@/icons/SpinnerIcon";

const AddSubcategoryForm = ({ onAddSubcategory, onCancel }) => {
  const [title, setTitle] = useState("");
  const [imgFile, setImgFile] = useState(null);
  const [iconFile, setIconFile] = useState(null);
  const [showInMenu, setShowInMenu] = useState("false");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("title", title);
    if (imgFile) formData.append("img", imgFile);
    if (iconFile) formData.append("icon", iconFile);
    formData.append("showInMenu", showInMenu);

    try {
      await onAddSubcategory(formData); // Llamamos a la función pasada como prop
      // Resetear el formulario
      setTitle("");
      setImgFile(null);
      setIconFile(null);
      setShowInMenu("false");
    } catch (error) {
      toast.error("Error al agregar la subcategoría. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 space-y-4">
        <h2 className="text-lg font-semibold mb-4">Agregar Nueva Subcategoría</h2>

        <form onSubmit={handleSubmit} className="space-y-3">
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
              placeholder="Escribe el título"
              required
            />
          </div>

          <div>
            <label htmlFor="img" className="block text-sm font-medium text-gray-700">
              Imagen
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

          <div>
            <label htmlFor="icon" className="block text-sm font-medium text-gray-700">
              Ícono
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

          <div className="flex gap-2">
            <button
              type="submit"
              className={`w-full px-3 py-1 bg-red-500 text-white text-sm rounded flex items-center justify-center ${
                loading ? "opacity-50" : ""
              } hover:bg-red-600`}
              disabled={loading}
            >
              {loading ? <SpinnerIcon className="w-5 h-5 animate-spin" /> : "Crear Subcategoría"}
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

export default AddSubcategoryForm;

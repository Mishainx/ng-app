import { useState } from 'react';
import { useCategories } from '@/context/CategoriesContext';
import SpinnerIcon from '@/icons/SpinnerIcon';
import { toast } from 'react-toastify';

const AddCategoryForm = ({ resetView, onCategoryCreated }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState(''); // Nuevo estado para la descripción
  const [imgFile, setImgFile] = useState(null);
  const [iconFile, setIconFile] = useState(null);
  const [showInMenu, setShowInMenu] = useState('false');
  const [loading, setLoading] = useState(false);

  // Traemos la función addCategory del contexto
  const { addCategory } = useCategories();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description); // Agregar descripción al formData
    formData.append('img', imgFile);
    formData.append('icon', iconFile);
    formData.append('showInMenu', showInMenu);

    try {
      // Llamamos a la función addCategory del contexto
      await addCategory(formData);

      // Mostrar mensaje de éxito
      toast.success('Categoría creada exitosamente');

      // Notificamos que la categoría ha sido creada
      if (onCategoryCreated) {
        onCategoryCreated(); // Cambia la vista a la tabla
      }

      // Resetear el formulario
      setTitle('');
      setDescription('');
      setImgFile(null);
      setIconFile(null);
      setShowInMenu('false');
    } catch (error) {
      // Mostrar mensaje de error
      toast.error('Error al crear la categoría. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-lg font-semibold mb-4">Agregar Nueva Categoría</h2>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">Título</label>
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
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Descripción</label>
          <textarea
            id="description"
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-red-500"
            placeholder="Máximo 100 caracteres"
            maxLength="100"
          />
        </div>

        <div>
          <label htmlFor="img" className="block text-sm font-medium text-gray-700">Imagen</label>
          <input
            type="file"
            id="img"
            name="img"
            accept="image/jpeg, image/png"
            onChange={(e) => setImgFile(e.target.files[0])}
            className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-red-500"
            required
          />
        </div>

        <div>
          <label htmlFor="icon" className="block text-sm font-medium text-gray-700">Ícono</label>
          <input
            type="file"
            id="icon"
            name="icon"
            accept="image/jpeg, image/png"
            onChange={(e) => setIconFile(e.target.files[0])}
            className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-red-500"
            required
          />
        </div>

        <div>
          <label htmlFor="showInMenu" className="block text-sm font-medium text-gray-700">Mostrar en Menú</label>
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

        <button
          type="submit"
          className={`w-full px-3 py-1 bg-red-500 text-white text-sm rounded flex items-center justify-center ${loading ? 'opacity-50' : ''} hover:bg-red-600`}
          disabled={loading}
        >
          {loading ? <SpinnerIcon className="w-5 h-5 animate-spin" /> : 'Crear Categoría'}
        </button>
      </form>
    </div>
  );
};

export default AddCategoryForm;

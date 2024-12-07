import { useState } from 'react';
import { useCategories } from '@/context/CategoriesContext';  // Asegúrate de importar el hook del contexto

const AddCategoryForm = () => {
  const [title, setTitle] = useState('');
  const [imgFile, setImgFile] = useState(null);
  const [iconFile, setIconFile] = useState(null);
  const [showInMenu, setShowInMenu] = useState('false');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Aquí traemos la función addCategory del contexto
  const { addCategory } = useCategories();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('title', title);
    formData.append('img', imgFile);
    formData.append('icon', iconFile);
    formData.append('showInMenu', showInMenu);

    try {
      // Aquí enviamos los datos a la función addCategory
      await addCategory(formData);  // Suponiendo que addCategory gestiona el fetch hacia el backend

      // Si todo sale bien, mostramos un mensaje de éxito
      alert('Categoría creada exitosamente');
    } catch (error) {
      setError('Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-2xl font-semibold mb-6">Agregar Nueva Categoría</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="title" className="block text-gray-700">Título de la Categoría</label>
          <input
            type="text"
            id="title"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            placeholder="Escribe el título de la categoría"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="img" className="block text-gray-700">Imagen Principal</label>
          <input
            type="file"
            id="img"
            name="img"
            accept="image/jpeg, image/png"
            onChange={(e) => setImgFile(e.target.files[0])}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="icon" className="block text-gray-700">Ícono</label>
          <input
            type="file"
            id="icon"
            name="icon"
            accept="image/jpeg, image/png"
            onChange={(e) => setIconFile(e.target.files[0])}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Mostrar en Menú</label>
          <select
            id="showInMenu"
            name="showInMenu"
            value={showInMenu}
            onChange={(e) => setShowInMenu(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="true">Sí</option>
            <option value="false">No</option>
          </select>
        </div>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <button
          type="submit"
          className={`w-full p-3 bg-red-500 text-white rounded-md ${loading ? 'opacity-50' : ''} hover:bg-red-700`}
          disabled={loading}
        >
          {loading ? 'Cargando...' : 'Crear Categoría'}
        </button>
      </form>
    </div>
  );
};

export default AddCategoryForm;

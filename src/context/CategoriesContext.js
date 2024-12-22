"use client"
// context/CategoriesContext.js
import { createContext, useState, useEffect, useContext } from 'react';

const CategoriesContext = createContext();

export const CategoriesProvider = ({ children, initialCategories }) => {
  const [categories, setCategories] = useState(initialCategories || []);
  const [loading, setLoading] = useState(false); // Inicializamos como false
  const [error, setError] = useState(null);

  // Función para traer las categorías (en caso de que necesitemos recargar)
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories`);
      if (!response.ok) {
        throw new Error('Error al traer las categorías');
      }
      const data = await response.json();
      setCategories(data.payload);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!initialCategories) {
      fetchCategories(); // Solo fetch si no pasamos categorías iniciales
    }
  }, [initialCategories]);

  // Las funciones de add, update, delete, etc. se mantienen igual
  const addCategory = async (formData) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Error al crear la categoría');
      }

      const result = await response.json();
      setCategories((prevCategories) => [...prevCategories, result.category]);
    } catch (error) {
      setError(error.message);
    }
  };

  // Continuar con el resto de las funciones (updateCategory, deleteCategory, etc.)

  return (
    <CategoriesContext.Provider value={{
      categories,
      loading,
      error,
      addCategory,
      // Otras funciones de categorías...
    }}>
      {children}
    </CategoriesContext.Provider>
  );
};

export const useCategories = () => {
  const context = useContext(CategoriesContext);
  if (!context) {
    throw new Error('useCategories debe ser usado dentro de CategoriesProvider');
  }
  return context;
};

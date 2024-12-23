"use client"
// context/CategoriesContext.js
import { createContext, useState, useEffect, useContext } from 'react';

const CategoriesContext = createContext();

export const CategoriesProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Función para traer las categorías desde la API
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories`);
      if (!response.ok) {
        throw new Error('Error al traer las categorías');
      }
      const data = await response.json();
      setCategories(data.payload); // Asignar las categorías al estado
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Cargar categorías al montar el componente
  useEffect(() => {
    fetchCategories();
  }, []); // Solo se ejecuta una vez cuando el componente se monta

  // Funciones de manejo de categorías
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

  // Función para actualizar una categoría
  const updateCategory = async (categorySlug, updatedData) => {
    try {
      const formData = new FormData();
      for (const [key, value] of Object.entries(updatedData)) {
        formData.append(key, value);
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories/${categorySlug}`, {
        method: 'PUT',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al actualizar la categoría');
      }

      // Recargar las categorías después de actualizar
      await fetchCategories();
      return response.json();
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Función para eliminar una categoría
  const deleteCategory = async (categorySlug) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories/${categorySlug}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Error al eliminar la categoría');
      }

      setCategories((prevCategories) =>
        prevCategories.filter((category) => category.slug !== categorySlug)
      );
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Funciones para manejar subcategorías
  const addSubcategory = async (categorySlug, formData) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories/${categorySlug}/subcategories`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al crear la subcategoría');
      }

      const result = await response.json();
      setCategories((prevCategories) =>
        prevCategories.map((category) =>
          category.slug === categorySlug
            ? { ...category, subcategories: [...(category.subcategories || []), result.subcategory] }
            : category
        )
      );

      return { status: 'success', subcategory: result.subcategory };
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const deleteSubcategory = async (categorySlug, subcategorySlug) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories/${categorySlug}/subcategories/${subcategorySlug}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Error al eliminar la subcategoría');
      }

      setCategories((prevCategories) =>
        prevCategories.map((category) =>
          category.slug === categorySlug
            ? { ...category, subcategories: category.subcategories.filter((sub) => sub.slug !== subcategorySlug) }
            : category
        )
      );
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const updateSubcategory = async (categorySlug, subcategorySlug, updatedData) => {
    try {
      const formData = new FormData();
      for (let [key, value] of updatedData.entries()) {
        formData.append(key, value);
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories/${categorySlug}/subcategories/${subcategorySlug}`, {
        method: 'PUT',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al actualizar la subcategoría');
      }

      const result = await response.json();
      setCategories((prevCategories) =>
        prevCategories.map((category) =>
          category.slug === categorySlug
            ? {
                ...category,
                subcategories: category.subcategories.map((sub) =>
                  sub.slug === subcategorySlug ? { ...sub, ...result.subcategory } : sub
                ),
              }
            : category
        )
      );

      return { status: 'success', subcategory: result.payload };
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  return (
    <CategoriesContext.Provider
      value={{
        categories,
        loading,
        error,
        addCategory,
        updateCategory,
        deleteCategory,
        addSubcategory,
        deleteSubcategory,
        updateSubcategory,
      }}
    >
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

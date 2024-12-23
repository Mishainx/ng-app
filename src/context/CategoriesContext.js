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
// Función para actualizar una categoría
const updateCategory = async (categorySlug, updatedData) => {
  try {
    const formData = new FormData();
    
    // Agregar los datos al FormData
    for (const [key, value] of Object.entries(updatedData)) {

      formData.append(key, value);
    }

    console.log(formData)

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories/${categorySlug}`, {
      method: 'PUT',
      body: formData, // Enviar FormData
    });

    if (!response.ok) {
      const errorData = await response.json(); // Capturamos el cuerpo de error (si existe)
      throw new Error(errorData.message || 'Error al actualizar la categoría');
    }

    // Después de actualizar, recargamos el listado de categorías
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories`);
        if (!response.ok) {
          throw new Error('Error al traer las categorías');
        }
        const data = await response.json();
        setCategories(data.payload); // Actualiza el estado con las categorías más recientes
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    // Llamamos a la función para recargar las categorías después de la actualización
    await fetchCategories();
    
    return response.json(); // Puedes devolver lo que necesites, por ejemplo, la categoría actualizada si es necesario
  } catch (error) {
    setError(error.message);
    console.error("Error al actualizar la categoría:", error);
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

      setCategories((prevCategories) => prevCategories.filter((category) => category.slug !== categorySlug)); // Elimina la categoría del estado local
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const addSubcategory = async (categorySlug, formData) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories/${categorySlug}/subcategories`, {
        method: 'POST',
        body: formData, // Enviar FormData (title, img, icon, showInMenu, etc.)
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al crear la subcategoría');
      }
  
      // Obtener la nueva subcategoría desde la respuesta
      const result = await response.json();
  
      // Actualizar el estado local de categorías
      setCategories((prevCategories) => 
        prevCategories.map((category) => 
          category.slug === categorySlug
            ? { ...category, subcategories: [...(category.subcategories || []), result.subcategory] }
            : category
        )
      );

      return { status: 'success', subcategory: result.subcategory };
    } catch (error) {
      console.error("Error al crear la subcategoría:", error);
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
  
      // Actualizar el estado local eliminando la subcategoría
      setCategories((prevCategories) =>
        prevCategories.map((category) =>
          category.slug === categorySlug
            ? { ...category, subcategories: category.subcategories.filter(sub => sub.slug !== subcategorySlug) }
            : category
        )
      );
    } catch (error) {
      console.error("Error al eliminar la subcategoría:", error);
      setError(error.message);
      throw error;
    }
  };
  
  const updateSubcategory = async (categorySlug, subcategorySlug, updatedData) => {
    try {
      const formData = new FormData();
      // Iterar sobre updatedData y agregar los datos al FormData
      for (let [key, value] of updatedData.entries()) {
        formData.append(key, value);  // Agregar al FormData
      }
  
  
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/categories/${categorySlug}/subcategories/${subcategorySlug}`,
        {
          method: 'PUT',
          body: formData, // Enviar FormData con los datos actualizados
        }
      );
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al actualizar la subcategoría');
      }
  
      // Obtener la respuesta con la subcategoría actualizada
      const result = await response.json();
  
      // Actualizar el estado local de categorías
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
      console.error("Error al actualizar la subcategoría:", error);
      setError(error.message);
      throw error;
    }
  };
  

  return (
    <CategoriesContext.Provider value={{
      categories,
      loading,
      error,
      addCategory,
      updateCategory,
      deleteCategory,
      addSubcategory, // Nueva función para agregar subcategorías
      deleteSubcategory,
      updateSubcategory, // Nueva función para eliminar subcategorías

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

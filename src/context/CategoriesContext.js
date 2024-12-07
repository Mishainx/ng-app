"use client";

import { createContext, useState, useEffect, useContext } from 'react';

const CategoriesContext = createContext();

export const CategoriesProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Función para traer las categorías
  useEffect(() => {
    const fetchCategories = async () => {
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

    fetchCategories();
  }, []);

  // Función para agregar una categoría
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
      setCategories((prevCategories) => [...prevCategories, result.payload]); // Añadir la nueva categoría a la lista
    } catch (error) {
      setError(error.message);
      throw error; // Lanza el error para que pueda ser manejado en el componente
    }
  };

  return (
    <CategoriesContext.Provider value={{ categories, loading, error, addCategory }}>
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

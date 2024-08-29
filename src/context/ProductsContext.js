"use client"

// context/ProductContext.js
import React, { createContext, useState, useEffect, useContext } from "react";

// Importa el JSON directamente
import productsData from "../../src/data/products.json"; 

// Crea el contexto
export const ProductContext = createContext();

export const useProducts = () => {
    const context = useContext(ProductContext);
    
    if (!context) {
      throw new Error("useProducts debe ser usado dentro de un ProductProvider");
    }
  
    return context;
  };

// Proveedor del contexto
export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  console.log(products)

  useEffect(() => {
    try {
      // Simula una llamada a una API y actualiza el estado con los datos del JSON
      setProducts(productsData);
      setLoading(false);
    } catch (error) {
      setError("Error al cargar los productos");
      setLoading(false);
    }
  }, []);

  return (
    <ProductContext.Provider value={{ products, loading, error }}>
      {children}
    </ProductContext.Provider>
  );
};

"use client";

import { createContext, useState, useEffect, useContext } from 'react';

const ProductsContext = createContext();

export const ProductsProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`);
        if (!response.ok) {
          throw new Error('Error al traer los productos');
        }
        const data = await response.json();
        setProducts(data.payload);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const addProduct = async (newProduct) => {
    try {
      const formData = new FormData();
  
// Agregar los campos al FormData
for (const key in newProduct) {
  if (key === "category" && newProduct[key] === "") {
    // Si la categoría es una cadena vacía, asignar "otros" en lugar de undefined
    formData.append(key, "otros");
  } else if (key === "subcategories" && Array.isArray(newProduct[key])) {
    newProduct[key].forEach((subcategory) => {
      formData.append("subcategory", subcategory);
    });
  } else if (key === "img" && newProduct.img) {
    formData.append(key, newProduct.img); // Agregar archivo
  } else {
    formData.append(key, newProduct[key]);
  }
}


  
      // Realizar la petición al backend
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`, {
        method: "POST",
        body: formData,
      });

 
      if (!response.ok) {
        const errorData = await response.json(); // Parsear el error desde el backend
        throw new Error(errorData.message || "Error al agregar producto");
      }
  
      const createdProduct = await response.json();
      setProducts((prevProducts) => [...prevProducts, createdProduct.product]);
      return createdProduct; // Retornar el producto creado
    } catch (error) {
      setError(error.message);
      throw error; // Lanzar el error para manejarlo en el componente
    }
  };
  
  
  
  
  const updateProduct = async (updatedProduct) => {
    try {
      const formData = new FormData();
  
// Agregar los campos al FormData
for (const key in updatedProduct) {
  if (key === "category" && updatedProduct[key] === "") {
    // Si la categoría es una cadena vacía, asignar "otros" en lugar de undefined
    formData.append(key, "otros");
  } else if (key === "subcategory" && Array.isArray(updatedProduct[key])) {
    updatedProduct[key].forEach((subcategory) => {
      formData.append("subcategory", subcategory);
    });
  } else if (key === "img" && updatedProduct.img) {
    formData.append(key, updatedProduct.img); // Agregar archivo
  } else if (key === "stock" || key === "visible" || key === "featured") {
    // Convertir los valores booleanos a "true" o "false" en formato cadena
    formData.append(key, updatedProduct[key] ? "true" : "false");
  } else {
    formData.append(key, updatedProduct[key]);
  }
}


  
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/products/${updatedProduct.slug}`,
        {
          method: "PUT",
          body: formData, // Enviar FormData
        }
      );
  
      if (!response.ok) {
        throw new Error("Error al actualizar producto");
      }
  
      const updatedData = await response.json();
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.slug === updatedData.payload.slug ? updatedData.payload : product
        )
      );
    } catch (error) {
      setError(error.message);
    }
  };

  // Función para eliminar un producto
  const deleteProduct = async (slug) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/${slug}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Error al eliminar producto');
      }

      setProducts((prevProducts) => prevProducts.filter((product) => product.slug !== slug));
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <ProductsContext.Provider
      value={{ products, loading, error, addProduct, updateProduct, deleteProduct }}
    >
      {children}
    </ProductsContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error('useProducts debe ser usado dentro de ProductsProvider');
  }
  return context;
};

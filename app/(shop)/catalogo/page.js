"use client"

import { useEffect, useState } from "react";
import CatalogueContainer from "@/components/catalogue/CatalogueContainer";

export default function Catalogo() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/API/PRODUCTS`);
        if (!response.ok) {
          throw new Error("Error fetching products");
        }
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Lista de Productos</h1>
      <CatalogueContainer products={products} />
    </div>
  );
}

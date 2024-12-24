"use client";

import { useState, useEffect } from "react";
import Loader from "@/components/loader/Loader";
import ProductsByCategoryContainer from '@/components/product/productByCategoryContainer';
import CategoriesBanner from '@/components/categories/categoriesBanner';

const ProductsBySubcategory = ({ params }) => {
  const { category, subcategory } = params;
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch data only once based on categorySlug and subcategorySlug
  useEffect(() => {
    if (!category || !subcategory) return; // Verifica que ambos params estén disponibles

    const fetchProducts = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/categories/${category}/${subcategory}`, {
          cache: "no-store",
        });
        const data = await response.json();
        // Filtrar los productos sin imágenes
        const validProducts = data.payload.filter(product => product?.img);
        setProducts(validProducts); // Establecer los productos en el estado
        setLoading(false); // Establecer loading a false cuando los datos se han cargado
      } catch (error) {
        console.error("Error al obtener los productos:", error);
        setLoading(false); // Establecer loading a false si hay un error
      }
    };

    fetchProducts();
  }, [category, subcategory]); // Dependencias de categorySlug y subcategorySlug

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader />
      </div>
    );
  }

  return (
    <main>
      <CategoriesBanner selectedCategory={category} selectedSubCategory={subcategory} />
      <section>
        <div className="relative text-center mb-2">
          <h2 className="text-2xl font-bold text-gray-900 inline-block relative my-2">
            Productos
            <div className="absolute inset-x-0 -bottom-2 mx-auto w-full h-1 bg-red-500"></div>
          </h2>
        </div>
        <ProductsByCategoryContainer products={products} />
      </section>
    </main>
  );
};

export default ProductsBySubcategory;

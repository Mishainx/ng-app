"use client";

import { useState, useEffect } from "react";
import CatalogueList from "./CatalogueList";
import FilterComponent from "./FilterComponent";
import { useCategories } from "@/context/CategoriesContext";

export default function CatalogueContainer({ products, total }) {
  const [filteredProducts, setFilteredProducts] = useState(products);
  console.log(filteredProducts);
  console.log(products)
  const [sortOption, setSortOption] = useState({ key: "name", direction: "asc" });
  const { categories } = useCategories();

  // Función para ordenar productos
  const sortProducts = (productsToSort, key, direction) => {
    const sortedProducts = [...productsToSort]; // Copiar el array
    return sortedProducts.sort((a, b) => {
      const valA = a[key];
      const valB = b[key];
      if (direction === "asc") {
        return valA > valB ? 1 : -1;
      } else {
        return valA < valB ? 1 : -1;
      }
    });
  };

  // Función de filtro para manejar los productos
  const handleFilter = (selectedCategory = "all", selectedSubcategory = "", searchTerm = "") => {
    let filtered = [...products]; // Copiar los productos para evitar mutar el original

    // Filtrar por categoría
    if (selectedCategory !== "all") {
      filtered = filtered.filter((product) => product.category === selectedCategory);
    }

    // Filtrar por subcategoría
    if (selectedSubcategory) {
      filtered = filtered.filter((product) =>
        product?.subcategory?.includes(selectedSubcategory)
      );
    }

    // Filtrar por término de búsqueda
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter((product) => {
        const matchesName = product?.name?.toLowerCase().includes(searchLower);
        const matchesLongDescription = product?.longDescription?.toLowerCase().includes(searchLower);
        const matchesCategory = product?.category?.toLowerCase().includes(searchLower);
        const matchesSubcategory = product?.subcategory?.some((subcat) =>
          subcat.toLowerCase().includes(searchLower)
        );
        return matchesName || matchesLongDescription || matchesCategory || matchesSubcategory;
      });
    }

    // Ordenar los productos según el criterio seleccionado
    filtered = sortProducts(filtered, sortOption.key, sortOption.direction);
    setFilteredProducts(filtered);
  };

  // Cambiar la opción de orden
  const handleSortChange = (key, direction) => {
    setSortOption({ key, direction });
    const sorted = sortProducts([...filteredProducts], key, direction);
    setFilteredProducts(sorted);
  };

  // UseEffect para manejar cambios en el array de productos y asegurarse de que la lista de productos filtrados se actualice
  useEffect(() => {
    setFilteredProducts(products); // Inicia con todos los productos
  }, [products]);

  return (
    <section className="w-full flex flex-col items-center justify-center">
      <FilterComponent
        categories={categories}
        onFilter={handleFilter}
        onSortChange={handleSortChange}
      />
      {/* Mostrar la cantidad de productos filtrados */}
      <p className="text-center mt-4">
        {filteredProducts.length} productos encontrados
      </p>
      <CatalogueList products={filteredProducts} total={total} /> {/* Pasamos total */}
    </section>
  );
}

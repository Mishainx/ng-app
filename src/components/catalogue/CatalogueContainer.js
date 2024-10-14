"use client";

import { useState } from "react";
import CatalogueList from "./CatalogueList";
import FilterComponent from "./FilterComponent";

export default function CatalogueContainer({ products, categories }) {
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [sortOption, setSortOption] = useState({ key: "name", direction: "asc" });

  const sortProducts = (productsToSort, key, direction) => {
    return productsToSort.sort((a, b) => {
      const valA = a[key];
      const valB = b[key];

      if (direction === "asc") {
        return valA > valB ? 1 : -1;
      } else {
        return valA < valB ? 1 : -1;
      }
    });
  };

  const handleFilter = (selectedCategory, selectedSubcategory, searchTerm) => {
    let filtered = products;

    // Filtrar por categoría
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (product) => product.category === selectedCategory
      );
    }

    // Filtrar por subcategoría (si se selecciona una)
    if (selectedSubcategory) {
      filtered = filtered.filter((product) => {
        // Comprobar si alguna subcategoría del producto coincide con la subcategoría seleccionada
        return product.subcategory.includes(selectedSubcategory);
      });
    }

    // Filtrar por término de búsqueda
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter((product) => {
        const matchesName = product?.name?.toLowerCase().includes(searchLower);
        const matchesLongDescription = product?.longDescription?.toLowerCase().includes(searchLower);
        const matchesCategory = product?.category?.toLowerCase().includes(searchLower);
        const matchesSubcategory = product?.subcategory.some((subcat) =>
          subcat.toLowerCase().includes(searchLower)
        );

        return matchesName || matchesLongDescription || matchesCategory || matchesSubcategory;
      });
    }

    // Ordenar los productos según el criterio seleccionado
    filtered = sortProducts(filtered, sortOption.key, sortOption.direction);
    setFilteredProducts(filtered);
  };

  const handleSortChange = (key, direction) => {
    setSortOption({ key, direction });
    const sorted = sortProducts([...filteredProducts], key, direction);
    setFilteredProducts(sorted);
  };

  return (
    <section className="w-full flex flex-col items-center justify-center">
      <FilterComponent
        categories={categories}
        onFilter={handleFilter}
        onSortChange={handleSortChange}
      />
      <CatalogueList products={filteredProducts} />
    </section>
  );
}

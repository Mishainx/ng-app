"use client";

import { useState, useEffect } from "react";
import CatalogueList from "./CatalogueList";
import FilterComponent from "./FilterComponent";
import { useCategories } from "@/context/CategoriesContext";
import { useProducts } from "@/context/ProductsContext";

export default function CatalogueContainer() {
  // Get products from ProductsContext
  const { products } = useProducts();
  
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [sortOption, setSortOption] = useState({ key: "name", direction: "asc" });
  const { categories } = useCategories();

  // Function to sort products
  const sortProducts = (productsToSort, key, direction) => {
    const sortedProducts = [...productsToSort]; // Copy the array
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

  // Handle filtering products
  const handleFilter = (selectedCategory = "all", selectedSubcategory = "", searchTerm = "") => {
    let filtered = [...products]; // Copy the products to avoid mutating the original array

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter((product) => product.category === selectedCategory);
    }

    // Filter by subcategory
    if (selectedSubcategory) {
      filtered = filtered.filter((product) =>
        product?.subcategory?.includes(selectedSubcategory)
      );
    }

    // Filter by search term
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

    // Sort the products according to the selected criteria
    filtered = sortProducts(filtered, sortOption.key, sortOption.direction);
    setFilteredProducts(filtered);
  };

  // Change the sort option
  const handleSortChange = (key, direction) => {
    setSortOption({ key, direction });
    const sorted = sortProducts([...filteredProducts], key, direction);
    setFilteredProducts(sorted);
  };

  // Update filtered products when the products context changes
  useEffect(() => {
    setFilteredProducts(products); // Initialize with all products
  }, [products]);

  return (
    <section className="w-full flex flex-col items-center justify-center">
      <FilterComponent
        categories={categories}
        onFilter={handleFilter}
        onSortChange={handleSortChange}
      />
      {/* Display the number of filtered products */}
      <p className="text-center mt-4">
        {filteredProducts?.length} productos encontrados
      </p>
      <CatalogueList products={filteredProducts}  />
    </section>
  );
}

"use client";

import { useState, useEffect } from "react";
import { capitalizeFirstLetter } from "@/utils/stringsManager";

export default function FilterComponent({
  categories,
  onFilter,
  onSortChange,
}) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [subcategories, setSubcategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("name-asc");

  useEffect(() => {
    // Initialize subcategories when the selected category changes
    const selectedCategoryObj = categories.find?(
      (category) => category.slug === selectedCategory
    );
    setSubcategories(selectedCategoryObj?.subcategories || []);
    setSelectedSubcategory("");
  }, [selectedCategory, categories]);

  const handleCategoryChange = (e) => {
    const categorySlug = e.target.value;
    setSelectedCategory(categorySlug);
    // Filter products based on the selected category
    onFilter(categorySlug, "", searchTerm);
  };

  const handleSubcategoryChange = (e) => {
    const subcategorySlug = e.target.value;
    setSelectedSubcategory(subcategorySlug);
    // Filter products based on selected category and subcategory
    onFilter(selectedCategory, subcategorySlug, searchTerm);
  };

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    // Filter products based on search term
    onFilter(selectedCategory, selectedSubcategory, term);
  };

  const handleSortChange = (e) => {
    const selectedSort = e.target.value;
    setSortOption(selectedSort);
    const [key, direction] = selectedSort.split("-");
    onSortChange(key, direction);
  };

  return (
    <div className="w-full flex flex-col items-center p-4 bg-gray-100 rounded-lg">
      {/* Input de búsqueda */}
      <div className="relative mb-2 w-full">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Buscar productos..."
          className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 w-full"
        />
      </div>

      {/* Filtros visibles en pantallas móviles y en fila a partir de md */}
      <div className="flex flex-col md:flex-row md:space-x-4 w-full mb-4">
        <div className="w-full mb-2 md:mb-0 min-w-[200px]">
          <select
            value={selectedCategory}
            onChange={handleCategoryChange}
            className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 w-full"
          >
            <option value="all">Todas las Categorías</option>
            {categories?.map((category) => (
              <option key={category.slug} value={category.slug}>
                {capitalizeFirstLetter(category.title)}
              </option>
            ))}
          </select>
        </div>

        {subcategories.length > 0 && (
          <div className="w-full mb-2 md:mb-0 min-w-[200px]">
            <select
              value={selectedSubcategory}
              onChange={handleSubcategoryChange}
              className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 w-full"
            >
              <option value="">Todas las Subcategorías</option>
              {subcategories.map((subcategory) => (
                <option key={subcategory.slug} value={subcategory.slug}>
                  {capitalizeFirstLetter(subcategory.title)}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="w-full min-w-[200px]">
          <select
            value={sortOption}
            onChange={handleSortChange}
            className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 w-full"
          >
            <option value="name-asc">Nombre (A-Z)</option>
            <option value="name-desc">Nombre (Z-A)</option>
            <option value="price-asc">Precio (Menor a Mayor)</option>
            <option value="price-desc">Precio (Mayor a Menor)</option>
          </select>
        </div>
      </div>
    </div>
  );
}

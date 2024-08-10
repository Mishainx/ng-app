"use client";

import { useState } from "react";
import categories from "../../data/categories.json";

const ProductFilter = ({ onFilterChange }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [showCategories, setShowCategories] = useState(false);
  const [showFilterOverlay, setShowFilterOverlay] = useState(false);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onFilterChange({ searchTerm: value, selectedCategories, priceRange });
  };

  const handleCategoryChange = (category) => {
    const newCategories = selectedCategories.includes(category)
      ? selectedCategories.filter((cat) => cat !== category)
      : [...selectedCategories, category];
    setSelectedCategories(newCategories);
    onFilterChange({ searchTerm, selectedCategories: newCategories, priceRange });
  };

  const handlePriceChange = (e) => {
    const { name, value } = e.target;
    const newPriceRange = name === "min" ? [value, priceRange[1]] : [priceRange[0], value];
    setPriceRange(newPriceRange);
    onFilterChange({ searchTerm, selectedCategories, priceRange: newPriceRange });
  };

  return (
    <div className="relative w-full lg:w-1/4 p-4 bg-gray-100">
      <div className="flex justify-between items-center mb-4 md:hidden">
        <button
          className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white"
          onClick={() => setShowFilterOverlay(true)}
        >
          Filtrar Productos
        </button>
      </div>
      <div className={`fixed inset-0 bg-white z-50 p-4 ${showFilterOverlay ? 'flex' : 'hidden'} flex-col space-y-4 md:hidden`}>
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Filtrar Productos</h2>
          <button
            className="px-3 py-2 border border-gray-300 rounded-lg bg-white"
            onClick={() => setShowFilterOverlay(false)}
          >
            Cerrar
          </button>
        </div>
        <div className="mb-4 w-full">
          <label className="block text-gray-700">Buscar</label>
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            placeholder="Buscar productos..."
          />
        </div>
        <div className="mb-4 w-full">
          <h3 className="text-lg font-semibold">Categorías</h3>
          <button
            className="lg:hidden w-full px-3 py-2 border border-gray-300 rounded-lg bg-white"
            onClick={() => setShowCategories(!showCategories)}
          >
            Seleccionar Categoría
          </button>
          <div className={`flex-col space-y-2 ${showCategories ? 'flex' : 'hidden'} lg:flex lg:flex-col lg:space-y-2`}>
            {categories.map((category) => (
              <div key={category.categoryId} className="flex items-center">
                <input
                  type="checkbox"
                  id={category.categoryId}
                  checked={selectedCategories.includes(category.categoryId)}
                  onChange={() => handleCategoryChange(category.categoryId)}
                  className="mr-2"
                />
                <label htmlFor={category.categoryId} className="text-gray-700">
                  {category.title}
                </label>
              </div>
            ))}
          </div>
        </div>
        <div className="mb-4 w-full lg:w-full">
          <h3 className="text-lg font-semibold">Precio</h3>
          <div className="flex flex-col lg:flex-row lg:space-x-2">
            <div className="flex items-center lg:w-1/2">
              <label className="text-gray-700 mr-2">Min:</label>
              <input
                type="number"
                name="min"
                value={priceRange[0]}
                onChange={handlePriceChange}
                className="w-full px-2 py-1 border border-gray-300 rounded-lg"
              />
            </div>
            <div className="flex items-center lg:w-1/2 mt-2 lg:mt-0">
              <label className="text-gray-700 mr-2">Max:</label>
              <input
                type="number"
                name="max"
                value={priceRange[1]}
                onChange={handlePriceChange}
                className="w-full px-2 py-1 border border-gray-300 rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="hidden md:flex flex-col w-full p-4 bg-gray-100 space-y-4 lg:space-y-0">
        <h2 className="text-xl font-bold mb-4 hidden lg:block">Filtrar Productos</h2>

        <div className="mb-4 w-full">
          <label className="block text-gray-700">Buscar</label>
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            placeholder="Buscar productos..."
          />
        </div>

        <div className="mb-4 w-full">
          <h3 className="text-lg font-semibold hidden lg:block">Categorías</h3>
          <div className="flex-col space-y-2 lg:flex lg:flex-col lg:space-y-2">
            {categories.map((category) => (
              <div key={category.categoryId} className="flex items-center">
                <input
                  type="checkbox"
                  id={category.categoryId}
                  checked={selectedCategories.includes(category.categoryId)}
                  onChange={() => handleCategoryChange(category.categoryId)}
                  className="mr-2"
                />
                <label htmlFor={category.categoryId} className="text-gray-700">
                  {category.title}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-4 w-full lg:w-full">
          <h3 className="text-lg font-semibold hidden lg:block">Precio</h3>
          <div className="flex flex-col lg:flex-row lg:space-x-2">
            <div className="flex items-center lg:w-1/2">
              <label className="text-gray-700 mr-2">Min:</label>
              <input
                type="number"
                name="min"
                value={priceRange[0]}
                onChange={handlePriceChange}
                className="w-full px-2 py-1 border border-gray-300 rounded-lg"
              />
            </div>
            <div className="flex items-center lg:w-1/2 mt-2 lg:mt-0">
              <label className="text-gray-700 mr-2">Max:</label>
              <input
                type="number"
                name="max"
                value={priceRange[1]}
                onChange={handlePriceChange}
                className="w-full px-2 py-1 border border-gray-300 rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductFilter;

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import categoriesData from "../../../../src/data/categories.json"; // Importa el archivo JSON
import ProductList from "../../../../src/components/product/productList";

export default function Categories({ params }) {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);

  useEffect(() => {
    // Filtramos la categoría correspondiente según params
    const category = categoriesData.find((cat) =>
      cat.href.includes(params.category)
    );
    setSelectedCategory(category);
  }, [params.category]);

  const [scrollLeft, setScrollLeft] = useState(0);
  const [isOverflowing, setIsOverflowing] = useState(false);

  useEffect(() => {
    const container = document.getElementById("subcategories-container");
    if (container) {
      setIsOverflowing(container.scrollWidth > container.clientWidth);
    }
  }, [selectedCategory]);

  const handleScrollLeft = () => {
    const container = document.getElementById("subcategories-container");
    if (container) {
      container.scrollBy({ left: -200, behavior: "smooth" });
      setScrollLeft(container.scrollLeft - 200);
    }
  };

  const handleScrollRight = () => {
    const container = document.getElementById("subcategories-container");
    if (container) {
      container.scrollBy({ left: 200, behavior: "smooth" });
      setScrollLeft(container.scrollLeft + 200);
    }
  };

  const handleSubcategoryClick = (subcategoryId) => {
    setSelectedSubcategory(
      selectedSubcategory === subcategoryId ? null : subcategoryId
    );
  };

  return (
    <main>
      <section className="w-full flex flex-col items-center justify-center">
        {selectedCategory ? (
          <>
            {/* Banner */}
            <div className="relative w-full h-32 md:h-44 lg:h-52">
              <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <h1 className="text-white text-3xl md:text-4xl lg:text-5xl font-bold">
                  {selectedCategory.title}
                </h1>
              </div>
            </div>

            {/* Subcategorías */}
            <div className="w-full flex items-center justify-evenly px-4 mt-6">
              <button
                onClick={handleScrollLeft}
                className="w-10 h-10 flex items-center justify-center p-2 bg-white rounded-full shadow-md z-10"
              >
                &#8249;
              </button>
              <div
                id="subcategories-container"
                className="flex space-x-6 p-2 overflow-x-auto scrollbar-hide me-4 md:me-0"
              >
                {selectedCategory.subcategory.map((subcat) => (
                  <button
                    key={subcat.subCategoryId}
                    onClick={() => handleSubcategoryClick(subcat.subCategoryId)}
                    className={`px-4 py-2 rounded-lg transition-colors duration-300 ${
                      selectedSubcategory === subcat.subCategoryId
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100 hover:bg-gray-200 hover:shadow-md"
                    }`}
                  >
                    {subcat.title}
                  </button>
                ))}
              </div>
              <button
                onClick={handleScrollRight}
                className="w-10 h-10 flex items-center justify-center p-2 bg-white rounded-full shadow-md z-10"
              >
                &#8250;
              </button>
            </div>

            {/* Tipos */}
            {selectedSubcategory && (
              <div className="w-full mt-6">
                <div className="flex flex-wrap justify-center space-x-4">
                  {selectedCategory.subcategory
                    .find(
                      (subcategory) =>
                        subcategory.subCategoryId === selectedSubcategory
                    )
                    .types.map((type) => (
                      <Link
                        href={`/products/${type.href}`}
                        key={type.id}
                        className="px-4 py-2 border border-gray-300 rounded-md text-lg bg-white text-gray-700 hover:bg-blue-100 cursor-pointer transition-colors"
                      >
                        {type.title}
                      </Link>
                    ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <p>Category not found</p>
        )}
      </section>
      <section>
        <ProductList />
      </section>
    </main>
  );
}

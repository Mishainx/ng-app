"use client";
// Import the Image component from next/image
import { useCategories } from "@/context/CategoriesContext";
import { useState } from "react";
import Image from "next/image";

const ProductCategoryNav = ({ params }) => {
  console.log(params);
  const { categories } = useCategories();
  const [openCategory, setOpenCategory] = useState(null);

  const toggleCategory = (id) => {
    setOpenCategory(openCategory === id ? null : id);
  };

  return (
    <nav className="flex flex-col md:flex-row md:justify-around p-4 bg-gray-100">
      {categories.map((category) => (
        category.showInMenu && (
          <div key={category.id} className="relative flex flex-col items-center m-2">
            <button
              onClick={() => toggleCategory(category.id)}
              className="flex flex-col items-center focus:outline-none"
            >
              <Image
                src={category.icon}
                alt={category.title}
                width={12}
                height={12}
                className="h-12 w-12 mb-2"
              />
              <h3 className="text-lg font-semibold">{category.title}</h3>
            </button>
            {category.subcategories.length > 0 && (
              <ul className={`absolute left-0 w-48 mt-2 bg-white shadow-lg rounded-md transition-all duration-200 ease-in-out ${openCategory === category.id ? 'block' : 'hidden'}`}>
                {category.subcategories.map((subcategory) => (
                  subcategory.showInMenu && (
                    <li key={subcategory.slug} className="text-sm text-gray-600 hover:bg-gray-200">
                      <a
                        href={`categorias/${category.slug}/${subcategory.slug}`}
                        className="block px-4 py-2"
                      >
                        {subcategory.title}
                      </a>
                    </li>
                  )
                ))}
              </ul>
            )}
          </div>
        )
      ))}
    </nav>
  );
};

export default ProductCategoryNav;
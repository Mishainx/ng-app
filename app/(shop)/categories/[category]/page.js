"use client"

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import categoriesData from '../../../../src/data/categories.json'; // Importa el archivo JSON
import ProductList from '../../../../src/components/product/productList';
import CategoriesList from '../../../../src/components/home/categoriesList/categoriesList';

export default function Categories({ params }) {
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    // Filtramos la categoría correspondiente según params
    const category = categoriesData.find(cat => cat.href.includes(params.category));
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
      container.scrollBy({ left: -200, behavior: "smooth" }); // Ajusta este valor según el tamaño de las imágenes
      setScrollLeft(container.scrollLeft - 200);
    }
  };

  const handleScrollRight = () => {
    const container = document.getElementById("subcategories-container");
    if (container) {
      container.scrollBy({ left: 200, behavior: "smooth" }); // Ajusta este valor según el tamaño de las imágenes
      setScrollLeft(container.scrollLeft + 200);
    }
  };

  return (
    <main>
          <section className="w-full flex flex-col items-center justify-center">
      {selectedCategory ? (
        <>

          {/* Banner */}
          
          <div className="relative w-full h-32 md:h-44 lg:h-52">
            <Image
              src={selectedCategory.src}
              fill={true}
              alt={`${selectedCategory.title} banner`}
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black"></div>
            {/* Overlay para el texto */}
            <div className="absolute inset-0 flex items-center justify-center">
              <h1 className="text-white text-3xl md:text-4xl lg:text-5xl font-bold">{selectedCategory.title}</h1>
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
            <div id="subcategories-container" className="flex space-x-6 p-2 overflow-x-auto scrollbar-hide me-4 md:me-0">
              {selectedCategory.subcategory.map(subcat => (
                <Link href={subcat.href} key={subcat.subCategoryId}>
                  <button className="p-4 rounded-lg hover:bg-gray-200 hover:shadow-">
                    <div className="flex flex-col">
                      <div className="relative w-24 h-24">
                        <Image
                          src={subcat.src}
                          fill={true}
                          alt={`${subcat.title} subcategory`}
                          className="hover:scale-110 transition-transform duration-700 ease-in-out"
                        />
                      </div>
                      <h3 className="mt-2 text-center">{subcat.title}</h3>
                    </div>
                  </button>
                </Link>
              ))}
            </div>
            <button
              onClick={handleScrollRight}
              className="w-10 h-10 flex items-center justify-center p-2 bg-white rounded-full shadow-md z-10"
            >
              &#8250;
            </button>
          </div>
        </>
      ) : (
        <p>Category not found</p>
      )}
    </section>
    <section className=''>
      <ProductList/>
    </section>
    <div className='bg-slate-50 w-50 h-50'>
      adasd
    </div>
    </main>

  );
}

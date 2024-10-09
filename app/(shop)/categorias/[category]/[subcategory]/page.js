import Image from 'next/image';

export default function Subcategories({ params }) {

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
              {/* Overlay for the text */}
              <div className="absolute inset-0 flex items-center justify-center">
                <h1 className="text-white text-3xl md:text-4xl lg:text-5xl font-bold">{selectedCategory.title}</h1>
              </div>
            </div>

            {/* Subcategories */}
            <div className="w-full flex items-center justify-evenly px-4 mt-6">
              <button
                onClick={handleScrollLeft}
                className="w-8 h-8 flex items-center justify-center p-1 bg-gray-200 rounded-full shadow-md z-10"
                disabled={scrollLeft <= 0}
              >
                &#8249;
              </button>
              <div id="subcategories-container" className="flex space-x-2 p-2 overflow-x-auto scrollbar-hide">
                {selectedCategory.subcategory.map(subcat => (
                  <button
                    key={subcat.subCategoryId}
                    className={`px-3 py-1 rounded-lg font-semibold transition duration-300 ease-in-out capitalize
                      ${selectedSubcategory?.subCategoryId === subcat.subCategoryId
                        ? 'bg-red-500 text-white border border-red-600 shadow-md'
                        : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                      }`}
                    onClick={() => {
                      setSelectedSubcategory(subcat);
                      setSelectedType(null); // Clear selected type when changing subcategory
                    }}
                  >
                    {subcat.title}
                  </button>
                ))}
              </div>
              <button
                onClick={handleScrollRight}
                className="w-8 h-8 flex items-center justify-center p-1 bg-gray-200 rounded-full shadow-md z-10"
                disabled={!isOverflowing}
              >
                &#8250;
              </button>
            </div>

            {/* Types for selected subcategory */}
            {selectedSubcategory && (
              <div className="mt-6 w-full flex flex-col items-center px-4">
                <div className="flex flex-wrap justify-center gap-4">
                  {selectedSubcategory.types.map(type => (
                    <button
                      key={type.typeId} 
                      className={`flex flex-col items-center px-3 py-2 rounded-lg transition duration-300 ease-in-out capitalize
                        ${selectedType?.typeId === type.typeId
                          ? 'bg-red-500 text-white border border-red-600 shadow-md'
                          : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                        }`}
                      onClick={() => setSelectedType(type)}
                    >
                      <span>{type.title}</span>
                    </button>
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

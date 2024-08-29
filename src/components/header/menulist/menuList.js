import { useState } from "react";
import Link from "next/link";
import Image from "next/image"; // Importa el componente Image
import MenuIcon from "@/icons/MenuIcon";
import ArrowIcon from "@/icons/ArrowIcon";

const MenuList = ({ open, handleClose, pages, categories }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  const handleBackToCategories = () => {
    setSelectedCategory(null);
  };

  const handleLinkClick = () => {
    handleClose(); // Cierra el menú al hacer clic en un enlace
  };

  return (
    <div className={`${open ? 'visible opacity-100' : 'invisible opacity-0'} transition-all fixed inset-0 bg-gray-700/60 flex justify-end z-40`}>
      <aside className={`${!open ? 'translate-x-full md:translate-x-48 rounded-l-xl' : 'translate-x-0'} bg-slate-100 transition-all duration-700 w-full md:w-56 flex flex-col items-center p-2 shadow-lg ${open ? 'rounded-none' : ''}`}>
        <div onClick={handleClose} className="cursor-pointer mb-4 flex justify-center w-full">
          <MenuIcon width={25} height={25} />
        </div>
        <nav className="flex-1 overflow-auto w-full">
          <ul className="grid gap-1 w-full">
            {selectedCategory ? (
              <>
                <li className="w-full rounded-lg">
                  <button
                    className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg hover:bg-gray-700 hover:text-gray-200"
                    onClick={handleBackToCategories}
                  >
                    <ArrowIcon width={15} height={15} className='transform rotate-180' />
                    <span className="text-xs"></span>
                  </button>
                </li>
                <li className="w-full rounded-lg">
                  <Link
                    href={selectedCategory.href}
                    className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg hover:bg-gray-700 hover:text-gray-200"
                    prefetch={false}
                    onClick={handleLinkClick} // Cierra el menú al hacer clic en el enlace
                  >
                    <Image src={selectedCategory.srcMenu} alt={selectedCategory.title} width={24} height={24} className="w-6 h-6" />
                    <span className="text-xs">Todos los productos</span>
                  </Link>
                </li>
                {selectedCategory.subcategory.map((subCategory) => (
                  <li key={subCategory.subCategoryId} className="w-full rounded-lg">
                    <Link
                      href={subCategory.href}
                      className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg hover:bg-gray-700 hover:text-gray-200"
                      prefetch={false}
                      onClick={handleLinkClick} // Cierra el menú al hacer clic en el enlace
                    >
                      <Image src={subCategory.src} alt={subCategory.title} width={24} height={24} className="w-6 h-6" />
                      <span className="text-xs">{subCategory.title}</span>
                    </Link>
                  </li>
                ))}
              </>
            ) : (
              <>
                {pages.map((page, i) => (
                  <li key={i} className="w-full rounded-lg">
                    <Link
                      href={page.href}
                      className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg hover:bg-gray-700 hover:text-gray-200"
                      prefetch={false}
                      onClick={handleLinkClick} // Cierra el menú al hacer clic en el enlace
                    >
                      {page.src}
                      <span className="text-xs">{page.title}</span>
                      <div className="flex-grow" /> {/* Espacio flexible para alinear a la derecha */}
                      <ArrowIcon width={15} height={15} />
                    </Link>
                  </li>
                ))}
                {categories.map((category) => (
                  <li key={category.categoryId} className="w-full rounded-lg">
                    <button
                      className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg hover:bg-gray-700 hover:text-gray-200 w-full"
                      onClick={() => handleCategoryClick(category)}
                    >
                      <Image src={category.srcMenu} alt={category.title} width={24} height={24} className="w-6 h-6" />
                      <span className="text-xs">{category.title}</span>
                      <div className="flex-grow" /> {/* Espacio flexible para alinear a la derecha */}
                      <ArrowIcon width={15} height={15} />
                    </button>
                  </li>
                ))}
              </>
            )}
          </ul>
        </nav>
      </aside>
    </div>
  );
};

export default MenuList;

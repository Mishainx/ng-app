import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import MenuIcon from "@/icons/MenuIcon";
import HomeIcon from "@/icons/HomeIcon"; // Asegúrate de tener este ícono
import { useCategories } from "@/context/CategoriesContext";
import { capitalizeFirstLetter } from "@/utils/stringsManager";

const MenuList = ({ open, handleClose }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isMenuVisible, setIsMenuVisible] = useState(open);
  const { categories } = useCategories();

  useEffect(() => {
    if (open) {
      setIsMenuVisible(true);
    } else {
      const timer = setTimeout(() => setIsMenuVisible(false), 500);
      return () => clearTimeout(timer);
    }
  }, [open]);

  const handleLinkClick = () => {
    handleClose();
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory((prev) => (prev === category ? null : category));
  };

  const gamingCategory = categories.find(category => category.title.toLowerCase() === "gaming" && category.showInMenu);
  const otherCategories = categories.filter(category => category.title.toLowerCase() !== "gaming" && category.showInMenu);

  return (
    <div
      className={`fixed inset-0 bg-black/70 flex justify-end z-40 transition-opacity duration-500 ease-out ${
        open ? "opacity-100 visible" : "opacity-0 invisible"
      }`}
    >
      {isMenuVisible && (
        <aside
          className={`bg-white transition-transform duration-300 w-full md:w-72 flex flex-col items-start p-4 shadow-xl transform ${
            open ? "translate-x-0" : "translate-x-full opacity-0"
          }`}
        >
          <div
            onClick={handleClose}
            className="cursor-pointer mb-4 flex justify-center w-full"
          >
            <MenuIcon width={30} height={30} />
          </div>
          <nav className="flex-1 overflow-auto w-full">
            <ul className="space-y-0.5"> {/* Reduce espacio entre elementos */}
              {/* Link to Home */}
              <li className="relative">
                <div className="flex items-center justify-between w-full">
                  <Link href="/" onClick={handleLinkClick} className="w-full">
                    <button className="flex items-center space-x-2 text-left w-full p-3 rounded-lg transition-all duration-300 ease-in-out text-gray-800 hover:bg-gray-200 hover:text-gray-600"> {/* Reduce padding */}
                      <HomeIcon width={24} height={24} /> {/* Icono de home */}
                      <span className="font-medium">Inicio</span>
                    </button>
                  </Link>
                </div>
              </li>

              {/* Gaming Category */}
              {gamingCategory?.subcategories?.filter(sub => sub.showInMenu).length > 0 && (
                <li key={gamingCategory.id} className="relative">
                  <div className="flex items-center justify-between w-full">
                    <button
                      className="w-full flex items-center space-x-2 text-left p-3 rounded-lg transition-all duration-300 ease-in-out text-gray-800 hover:bg-gray-200 hover:text-gray-600"
                      onClick={() => handleCategoryClick(gamingCategory)}
                    >
                      <Image
                        src={gamingCategory.icon}
                        alt={gamingCategory.title}
                        width={24}
                        height={24}
                      />
                      <span className="font-medium">
                        {capitalizeFirstLetter(gamingCategory.title)}
                      </span>
                    </button>
                    <span
                      className={`transition-transform duration-100 cursor-pointer ${
                        selectedCategory === gamingCategory ? "rotate-180 text-red-600" : "text-gray-500"
                      }`}
                      onClick={() => handleCategoryClick(gamingCategory)}
                    >
                      ▼
                    </span>
                  </div>
                  <ul
                    className={`mt-2 space-y-1 overflow-hidden transition-max-height duration-300 ease-in-out ${
                      selectedCategory === gamingCategory ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    {selectedCategory === gamingCategory &&
                      gamingCategory.subcategories
                        .filter(sub => sub.showInMenu)
                        .map((sub) => (
                          <li key={sub.sku}>
                            <Link
                              href={`/categories/${gamingCategory.slug}/${sub.slug}`}
                              className="block bg-white text-gray-700 hover:text-gray-500 px-4 py-1 rounded"
                              onClick={handleLinkClick}
                            >
                              {capitalizeFirstLetter(sub.title)}
                            </Link>
                          </li>
                        ))}
                  </ul>
                </li>
              )}

              {/* Other Categories */}
              {otherCategories.map((category) => {
                const subcategoriesToShow = category.subcategories.filter(sub => sub.showInMenu);

                return (
                  <li key={category.id} className="relative">
                    <div className="flex items-center justify-between w-full">
                      <Link
                        href={`/categorias/${category.slug}`}
                        onClick={handleLinkClick}
                        className="w-full"
                      >
                        <button
                          className={`flex items-center space-x-2 text-left w-full p-3 rounded-lg transition-all duration-300 ease-in-out ${
                            selectedCategory === category
                              ? "bg-gray-100 text-red-600 font-semibold shadow-md"
                              : "text-gray-800 hover:bg-gray-200 hover:text-gray-600"
                          }`} // Reduce padding
                        >
                          <Image
                            src={category.icon}
                            alt={category.title}
                            width={24}
                            height={24}
                          />
                          <span className="font-medium">
                            {capitalizeFirstLetter(category.title)}
                          </span>
                        </button>
                      </Link>
                      {subcategoriesToShow.length > 0 && (
                        <span
                          className={`transition-transform duration-100 cursor-pointer ${
                            selectedCategory === category ? "rotate-180 text-red-600" : "text-gray-500"
                          }`}
                          onClick={() => handleCategoryClick(category)}
                        >
                          ▼
                        </span>
                      )}
                    </div>
                    <ul
                      className={`mt-2 space-y-1 overflow-hidden transition-max-height duration-300 ease-in-out ${
                        selectedCategory === category ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
                      }`}
                    >
                      {selectedCategory === category &&
                        subcategoriesToShow.map((sub) => (
                          <li key={sub.sku}>
                            <Link
                              href={`/categories/${category.slug}/${sub.slug}`}
                              className="block bg-white text-gray-700 hover:text-gray-500 px-4 py-1 rounded"
                              onClick={handleLinkClick}
                            >
                              {capitalizeFirstLetter(sub.title)}
                            </Link>
                          </li>
                        ))}
                    </ul>
                  </li>
                );
              })}
            </ul>
          </nav>
        </aside>
      )}
    </div>
  );
};

export default MenuList;

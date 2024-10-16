import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import MenuIcon from "@/icons/MenuIcon";
import HomeIcon from "@/icons/HomeIcon"; // Asegúrate de tener este ícono
import { useCategories } from "@/context/CategoriesContext";
import { capitalizeFirstLetter } from "@/utils/stringsManager";
import LoginButton from "../loginButton";

const MenuList = ({ open, handleClose, pages }) => {
  const [isMenuVisible, setIsMenuVisible] = useState(open);
  const { categories } = useCategories();
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false); // Estado para manejar las categorías

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

  const gamingCategory = categories.find(category => category.title.toLowerCase() === "gaming" && category.showInMenu);
  const otherCategories = categories.filter(category => category.title.toLowerCase() !== "gaming" && category.showInMenu);

  // Unir todas las categorías en una opción principal "Categorías"
  const allCategories = [...(gamingCategory ? [gamingCategory] : []), ...otherCategories];

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
            <ul className="space-y-0.5">
              {/* Link to Home */}
              <li className="relative">
                <Link href="/" onClick={handleLinkClick} className="w-full">
                  <button className="flex items-center space-x-2 text-left w-full p-3 rounded-lg transition-all duration-300 ease-in-out text-gray-800 hover:bg-gray-200 hover:text-gray-600">
                    <HomeIcon width={24} height={24} />
                    <span className="font-medium">Inicio</span>
                  </button>
                </Link>
              </li>

              {/* Additional Pages */}
              {pages.map((page) => (
                <li key={page.title} className="relative">
                  <Link href={page.href} onClick={handleLinkClick} className="w-full">
                    <button className="flex items-center space-x-2 text-left w-full p-3 rounded-lg transition-all duration-300 ease-in-out text-gray-800 hover:bg-gray-200 hover:text-gray-600">
                      {page.src}
                      <span className="font-medium">{capitalizeFirstLetter(page.title)}</span>
                    </button>
                  </Link>
                </li>
              ))}

              {/* Opción Categorías */}
              <li className="relative">
                <button
                  className="w-full flex items-center justify-between p-3 rounded-lg transition-all duration-300 ease-in-out text-gray-800 hover:bg-gray-200 hover:text-gray-600"
                  onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                >
                  <span className="font-medium">Categorías</span>
                  <span className={`text-gray-500 ${isCategoriesOpen ? 'rotate-180' : ''}`}>▼</span>
                </button>
                {isCategoriesOpen && (
                  <ul className="mt-2 space-y-1">
                    {allCategories.map((category) => (
                      <li key={category.id} className="relative">
                        <Link
                          href={`/categorias/${category.slug}`}
                          onClick={handleLinkClick}
                          className="w-full"
                        >
                          <button className="flex items-center space-x-2 text-left w-full p-3 rounded-lg transition-all duration-300 ease-in-out text-gray-800 hover:bg-gray-200 hover:text-gray-600">
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
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            </ul>
          </nav>
          
          {/* Espaciado para el LoginButton */}
          <div className="mt-auto w-full px-2" onClick={handleLinkClick}> {/* Ajuste de espaciado y alineación */}
            <LoginButton />
          </div>
        </aside>
      )}
    </div>
  );
};

export default MenuList;

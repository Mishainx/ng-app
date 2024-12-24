"use client";

import Link from "next/link";
import LoginButton from "../loginButton";
import { useAuth } from "@/context/AuthContext";
import ProfileIcon from "@/icons/ProfileIcon";

export default function DesktopMenu({ pages }) {
  const { userData, loading } = useAuth();

  return (
    <ul className="hidden lg:flex space-x-4">
      {pages.map((page, index) => {
        // Condición para no renderizar el botón de 'Order' si no hay usuario autenticado
        if (page.href === "/order" && !userData) {
          return null; // No renderiza este elemento si no hay usuario
        }

        const isOrderPage = page.href === "/order";
        const cartItemCount = userData?.cart?.length || 0;

        return (
          <li
            key={index}
            className="relative flex items-center justify-center gap-3 cursor-pointer py-2 text-xs text-black hover:text-red-500 group"
          >
            <Link href={page.href} className="relative z-10 flex items-center justify-center gap-2">
              <div className="relative flex items-center">
                {page.src}

                {/* Mostrar círculo rojo con el número de productos en el carrito */}
                {isOrderPage && cartItemCount > 0 && (
                  <span className="absolute -top-1 right-2 flex items-center justify-center w-3 h-3 text-white text-xs font-bold bg-red-500 rounded-full">
                    {cartItemCount}
                  </span>
                )}
              </div>
              <span>{page.title}</span>
            </Link>
          </li>
        );
      })}

      {/* Si hay usuario, mostrar su nombre y el botón de logout; de lo contrario, mostrar el botón de login */}
      {userData ? (
        <li className="flex items-center gap-4 text-xs font-semibold text-gray-700">
          {userData.name || userData.email ? (
            <Link href="/perfil" className="flex items-center justify-center gap-2">
              <ProfileIcon/><span> {`Hola, ${userData.name || userData.email}`}</span>
            </Link>
          ) :            <Link href="/perfil" className="flex items-center justify-center gap-2">
          <ProfileIcon/> <span>Mi perfil</span>
        </Link>}
          {/* Botón para cerrar sesión */}
          <LoginButton />
        </li>
      ) : (
        <LoginButton />
      )}
    </ul>
  );
}

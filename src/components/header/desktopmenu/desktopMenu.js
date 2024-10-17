"use client";

import Link from "next/link";
import LoginButton from "../loginButton";
import { useAuth } from "@/context/AuthContext";

export default function DesktopMenu({ pages }) {
  const { userData, loading } = useAuth();

  return (
    <ul className="hidden lg:flex space-x-4">
      {pages.map((page, index) => {
        // Condición para no renderizar el botón de 'Order' si no hay usuario autenticado
        if (page.href === "/order" && !userData) {
          return null; // No renderiza este elemento si no hay usuario
        }

        return (
          <li
            key={index}
            className="relative flex items-center justify-center gap-3 cursor-pointer py-2 text-xs text-black hover:text-red-500 group"
          >
            <Link href={page.href} className="relative z-10 flex items-center justify-center gap-2">
              {page.src}
              {page.title}
            </Link>
            <span className="absolute inset-x-0 bottom-0 h-0.5 bg-red-500 transition-transform duration-500 ease-in-out transform scale-x-0 group-hover:scale-x-100" />
          </li>
        );
      })}

      {/* Si hay usuario, mostrar su nombre y el botón de logout; de lo contrario, mostrar el botón de login */}
      {userData ? (
        <li className="flex items-center gap-4 text-xs font-semibold text-gray-700">
          <span>{`Hola, ${userData.name || userData.email}`}</span>
          {/* Botón para cerrar sesión */}
          <LoginButton /> {/* Asumimos que este botón maneja tanto login como logout */}
        </li>
      ) : (
        <LoginButton />
      )}
    </ul>
  );
}

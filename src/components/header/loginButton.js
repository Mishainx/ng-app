"use client"

import Link from "next/link";
import { useAuth } from "@/context/AuthContext"; // Importar el contexto de autenticación

export default function LoginButton() {
  const { userData } = useAuth();
   // Obtener el estado del usuario desde el contexto
  const handleLogout = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/logout`, {
        method: 'POST',
        credentials: 'include', // Asegúrate de incluir las cookies de sesión
      });
  
      if (response.ok) {
        // Redireccionar o actualizar el estado local
        window.location.reload(); // Recargar la página para actualizar el estado
      } else {
        console.error("Error al cerrar sesión:", await response.json());
      }
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };
  

  return (
    <>
      {userData ? ( // Verifica si hay un usuario autenticado
        <button
          onClick={handleLogout}
          className="text-xs text-white shadow-md bg-red-500 p-2 rounded-3xl hover:bg-red-700"
        >
          Cerrar sesión
        </button>
      ) : (
        <Link href="/login">
          <button className="text-xs text-white shadow-md bg-red-500 p-2 rounded-3xl hover:bg-red-700">
            Iniciar sesión
          </button>
        </Link>
      )}
    </>
  );
}

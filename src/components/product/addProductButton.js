"use client";

import { useEffect, useState } from 'react';
import Link from "next/link";
import { toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

export default function AddProductButton({ productSku, stock, quantity }) {
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false); // Estado para controlar el loading del botón

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/profile`, {
          method: 'GET',
          credentials: 'include', // Asegúrate de que se envíen las cookies
        });

        if (!response.ok) {
          throw new Error("Error fetching user profile");
        }

        const data = await response.json();
        setUserId(data.id); // Asegúrate de que tu API devuelva el userId
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleAddToCart = async () => {
    if (!userId) {
      toast.error("usuario no registrado")
      console.error("Usuario no registrado");
      return;
    }

    setIsAdding(true); // Empieza el loading

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/orders/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productSku,
          quantity,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error adding product to cart: ${errorData.message || 'Unknown error'}`);
      } else {
        toast.success("Producto agregado al pedido");
      }
    } catch (error) {
      toast.error("Failed to add product to cart");
      console.error("Failed to add product to cart:", error);
    } finally {
      setIsAdding(false); // Termina el loading
    }
  };

  if (loading) return <p>Cargando...</p>;

  return (
    <div className="flex flex-col gap-2 w-full">
      <button
        onClick={handleAddToCart}
        disabled={stock === 0 || isAdding} // Deshabilitar cuando no hay stock o se está añadiendo
        className={`w-full px-4 py-2 rounded-lg shadow-md font-semibold transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-red-400 ${
          stock === 0
            ? 'bg-gray-400 cursor-not-allowed text-white'
            : 'bg-red-500 hover:bg-red-600 text-white'
        }`}
      >
        {isAdding ? 'Añadiendo...' : stock === 0 ? 'Sin stock' : 'Agregar al carrito'}
      </button>

      <Link href="/catalogo">
        <button className="w-full px-4 py-2 rounded-lg shadow-md bg-gray-300 text-gray-700 font-semibold transition-colors duration-300 hover:bg-gray-400 focus:outline-none">
          Volver al Catálogo
        </button>
      </Link>
    </div>
  );
}

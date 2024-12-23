"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AddProductButton({ sku, stock, quantity }) {
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/users/profile`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error("Error fetching user profile");
        }

        const data = await response.json();
        setUserId(data.id);
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
      toast.error("Usuario no registrado");
      console.error("Usuario no registrado");
      return;
    }

    setIsAdding(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/orders/${userId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sku,
            quantity,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `Error adding product to cart: ${errorData.message || "Unknown error"}`
        );
      } else {
        toast.success("Producto agregado al pedido");
        setIsAdded(true);
      }
    } catch (error) {
      toast.error("Failed to add product to cart");
      console.error("Failed to add product to cart:", error);
    } finally {
      setIsAdding(false);
    }
  };

  if (loading) return <p className="text-sm text-gray-500">Cargando...</p>;

  return (
    <div className="flex flex-col gap-1 w-full space-y-1">
      {/* Botón para agregar al carrito */}
      <button
        onClick={handleAddToCart}
        disabled={stock === 0 || isAdding}
        className={`w-full px-3 py-1 rounded-md shadow font-medium text-sm transition-colors duration-200 focus:outline-none focus:ring-1 focus:ring-red-400 ${
          stock === 0
            ? "bg-gray-400 cursor-not-allowed text-white"
            : "bg-red-500 hover:bg-red-600 text-white"
        }`}
      >
        {isAdding ? "Añadiendo..." : stock === 0 ? "Sin stock" : "Agregar al carrito"}
      </button>

      {/* Botón de "Finalizar compra" que aparece si el producto se agregó correctamente */}
      {isAdded && (
        <Link href="/order">
          <button className="w-full px-3 py-1 rounded-md shadow bg-red-500 text-white text-sm font-medium transition-colors duration-200 hover:bg-red-600 focus:outline-none">
            Finalizar compra
          </button>
        </Link>
      )}

      {/* Botón para volver al catálogo */}
      <Link href="/catalogo">
        <button className="w-full px-3 py-1 rounded-md shadow bg-gray-300 text-gray-700 text-sm font-medium transition-colors duration-200 hover:bg-gray-400 focus:outline-none">
          Volver al Catálogo
        </button>
      </Link>
    </div>
  );
}

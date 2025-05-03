"use client";

import { useState } from "react";
import AddProductButton from "./addProductButton";
import Link from "next/link";

export default function ActionButtons({ sku, stock }) {
  const [quantity, setQuantity] = useState(1);

  const handleQuantityChange = (e) => {
    const value = e.target.value;
    if (value === "" || parseInt(value) <= 0) {
      setQuantity(0);
    } else if (parseInt(value)) {
      setQuantity(parseInt(value));
    }
  };

  return (
    <div className="flex flex-col justify-center gap-2 w-full max-w-xs">
      {stock > 0 ? (
        <>
          {/* Selector de cantidad */}
          <div className="flex items-center gap-3 justify-center">
            <label
              htmlFor="quantity"
              className="font-medium text-gray-700 text-xs"
            >
              Cantidad:
            </label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              value={quantity}
              onChange={handleQuantityChange}
              min="1"
              className="w-16 px-1 py-0.5 border border-gray-300 rounded-md text-center text-gray-700 focus:outline-none focus:border-red-500 text-xs"
            />
            <span className="text-xs text-gray-500">de {stock} disponibles</span>
          </div>

          {/* Botón para agregar al carrito */}
          <AddProductButton sku={sku} stock={stock} quantity={quantity} />
        </>
      ) : (
        <div className="flex flex-col gap-1 items-center">
          <p className="text-red-500 text-sm">Producto no disponible.</p>
          <Link href="/catalogo">
            <button className="w-full px-2 py-1 rounded-md bg-gray-300 text-gray-700 text-sm transition-colors duration-200 hover:bg-gray-400 focus:outline-none">
              Volver al Catálogo
            </button>
          </Link>
        </div>
      )}
    </div>
  );
}

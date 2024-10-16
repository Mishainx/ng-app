"use client";


import { useState } from 'react';
import AddProductButton from './addProductButton';
import Link from 'next/link';

export default function ActionButtons({ productSku, stock }) {
  const [quantity, setQuantity] = useState(1);

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= stock) {
      setQuantity(value);
    }
  };

  return (
    <div className="flex flex-col justify-center gap-2 w-full max-w-sm">
      {/* Mostrar selector de cantidad y botón solo si el stock es mayor que 0 */}
      {stock > 0 ? (
        <>
          {/* Selector de cantidad */}
          <div className="flex items-center gap-5 w-full justify-center">
            <label htmlFor="quantity" className="font-medium text-gray-700 text-sm">Cantidad:</label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              value={quantity}
              onChange={handleQuantityChange}
              min="1"
              max={stock}
              className="w-20 px-2 py-1 border border-gray-300 rounded-md text-center text-gray-700 focus:outline-none focus:border-red-500 text-sm"
            />
            <span className="text-xs text-gray-500">de {stock} disponibles</span>
          </div>

          {/* Botón para agregar al carrito */}
          <AddProductButton productSku={productSku} stock={stock} quantity={quantity} />
        </>
      ) : (
        <div className='flex flex-col gap-2'>
                    <p className=" text-red-500">Producto no disponible.</p>
                    <Link href="/catalogo">
        <button className="w-full px-2 py-1 rounded-lg shadow-md bg-gray-300 text-gray-700 transition-colors duration-300 hover:bg-gray-400 focus:outline-none">
          Volver al Catálogo
        </button>
      </Link>
        </div>
      )}
    </div>
  );
}

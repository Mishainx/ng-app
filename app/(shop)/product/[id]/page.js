"use client";

import { useRouter } from 'next/navigation';
import products from '../../../../src/data/products.json';
import Image from 'next/image';
import { useState } from 'react';

export default function ProductPage({ params }) {
  const router = useRouter();
  const { id } = params;

  // Asegúrate de convertir el id a número
  const productId = parseInt(id, 10);
  
  // Buscar el producto por ID
  const product = products.find(p => p.id === productId);

  // Definir el estado aquí para evitar llamadas condicionales a hooks
  const [quantity, setQuantity] = useState(1);

  const handleIncrement = () => {
    if (quantity < product?.stock) {
      setQuantity(quantity + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  // Retorno condicional para manejar cuando el producto no se encuentra
  if (!product) {
    return (
      <main className="p-4">
        <h1 className="text-2xl font-bold">Producto no encontrado</h1>
      </main>
    );
  }

  return (
    <main className="p-4 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-start space-y-4 md:space-y-0">
        <div className="md:w-1/2">
          <Image
            src={product.img}
            alt={product.title}
            width={400}
            height={400}
            className="object-cover shadow-md rounded-md"
          />
        </div>
        <div className="md:w-1/2 md:pl-6">
          <h1 className="text-3xl font-semibold mb-4">{product.title}</h1>
          <p className="text-lg font-medium mb-4">
            <span className="font-normal">Precio: </span>${product.price.toFixed(2)}
          </p>
          <p className="text-base mb-4">
            <span className="font-medium">Descripción: </span>{product.description}
          </p>
          <div className="flex items-center space-x-4 mb-6">
            <button
              className="px-3 py-1 bg-red-400 text-white font-medium rounded-md shadow-sm hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-400"
              onClick={handleDecrement}
            >
              -
            </button>
            <span className="text-lg font-medium">{quantity}</span>
            <button
              className="px-3 py-1 bg-red-400 text-white font-medium rounded-md shadow-sm hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-400"
              onClick={handleIncrement}
            >
              +
            </button>
          </div>
          <div className="flex space-x-4 mt-6">
            <button className="px-4 py-2 bg-red-400 text-white font-medium rounded-md shadow-sm hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-400">
              Agregar al carrito
            </button>
            <button
              onClick={() => router.back()}
              className="px-4 py-2 border border-red-400 text-red-400 font-medium rounded-md shadow-sm hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-400"
            >
              Volver a la tienda
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

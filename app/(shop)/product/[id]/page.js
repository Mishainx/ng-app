"use client";

import products from '../../../../src/data/products.json';
import Image from 'next/image';
import { useState } from 'react';
import Link from 'next/link';

export default function ProductPage({ params }) {
  const { id } = params;

  const productId = parseInt(id, 10);
  const product = products.find(p => p.id === productId);

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

  if (!product) {
    return (
      <main className="p-4">
        <h1 className="text-2xl font-bold">Producto no encontrado</h1>
      </main>
    );
  }

  return (
    <main className="p-10 max-w-6xl mx-auto">
      <div className="flex flex-col items-center md:flex-row md:items-start space-y-6 md:space-y-0">
        <div className="md:w-1/2">
          <Image
            src={product.img}
            alt={product.title}
            width={400}
            height={400}
            className="object-cover shadow-lg rounded-lg"
          />
        </div>
        <div className="md:w-1/2 md:pl-10">
          <h1 className="text-4xl font-bold mb-6 text-gray-800 text-center">{product.title}</h1>
          <p className="text-2xl text-center font-semibold text-red-500 mb-4">
            ${product.price.toFixed(2)}
          </p>
          <p className="text-base mb-4">
            <span className="font-medium text-gray-700">Presentación: </span>
            {`${product.shortDescription.charAt(0).toUpperCase()}${product.shortDescription.slice(1)}`}
          </p>
          <p className="text-base text-gray-600 mb-8 leading-relaxed">
            <span className="font-medium text-gray-700">Descripción: </span>
            {product.description}
          </p>
          <div className="flex justify-center items-center space-x-4 mb-8 md:justify-start">
            <button
              className="px-4 py-2 bg-gray-200 text-gray-700 font-medium rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
              onClick={handleDecrement}
            >
              -
            </button>
            <span className="text-xl font-semibold text-gray-800">{quantity}</span>
            <button
              className="px-4 py-2 bg-gray-200 text-gray-700 font-medium rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
              onClick={handleIncrement}
            >
              +
            </button>
          </div>
          <div className="flex justify-center space-x-4 mt-8 md:justify-start">
            <button className="px-6 py-3 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400">
              Agregar al carrito
            </button>
            <Link href="/catalogo">
              <button className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg shadow-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400">
                Volver a la tienda
              </button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

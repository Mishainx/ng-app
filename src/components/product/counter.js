"use client"

import { useState } from "react";

export default function Counter({ stock, onQuantityChange }) {
  const [quantity, setQuantity] = useState(1);

  const incrementQuantity = () => {
    if (quantity < stock) {
      const newQuantity = quantity + 1;
      setQuantity(newQuantity);
      onQuantityChange(newQuantity);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);
      onQuantityChange(newQuantity);
    }
  };

  const handleQuantityChange = (e) => {
    const value = Math.max(1, Math.min(stock, Number(e.target.value))); // Asegurar que esté entre 1 y stock
    setQuantity(value);
    onQuantityChange(value);
  };

  return (
    <div className="flex items-center space-x-2 mt-4">
      <button
        onClick={decrementQuantity}
        className="px-3 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-400"
      >
        -
      </button>
      <input
        type="number"
        value={quantity}
        onChange={handleQuantityChange}
        className="w-12 text-center border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
        min="1"
        max={stock}
      />
      <button
        onClick={incrementQuantity}
        className="px-3 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-400"
      >
        +
      </button>
    </div>
  );
}

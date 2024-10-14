"use client"

import { useState, useEffect } from "react";


const Order = ({ open, handleClose }) => {
  const [isMenuVisible, setIsMenuVisible] = useState(open);

  useEffect(() => {
    if (open) {
      setIsMenuVisible(true);
    } else {
      const timer = setTimeout(() => setIsMenuVisible(false), 500);
      return () => clearTimeout(timer);
    }
  }, [open]);

  return (
    <div
      className={`fixed inset-0 bg-black/70 flex justify-end z-40 transition-opacity duration-500 ease-out ${
        open ? "opacity-100 visible" : "opacity-0 invisible"
      }`}
    >
      {isMenuVisible && (
        <aside
          className={`bg-white transition-transform duration-300 w-full md:w-72 flex flex-col items-start p-4 shadow-xl transform ${
            open ? "translate-x-0" : "translate-x-full opacity-0"
          }`}
        >
          <div className="flex justify-between items-center w-full mb-4">
            <h2 className="font-semibold text-xl">Carrito</h2>
            <button onClick={handleClose}>
                x
            </button>
          </div>

          <nav className="flex-1 overflow-auto w-full">
           
          </nav>
        </aside>
      )}
    </div>
  );
};

export default Order;

"use client";

import { useEffect, useState } from "react";
import { capitalizeFirstLetter } from "@/utils/stringsManager";
import TrashIcon from "@/icons/TrashIcon";
import Link from "next/link";
import Loader from "@/components/loader/Loader";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import OrderButton from "@/components/order/OrderButton";

export default function Order() {
  const [userData, setUserData] = useState(null);
  const [products, setProducts] = useState([]);
  const [cartProducts, setCartProducts] = useState([]);
  const [error, setError] = useState(null);
  const [isCartLoading, setIsCartLoading] = useState(true);
  const [isProductsLoading, setIsProductsLoading] = useState(true);
  const [isOrderSent, setIsOrderSent] = useState(false);

  // Fetch user profile on page load
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/profile`);

        if (!response.ok) {
          throw new Error("Error al obtener el perfil del usuario");
        }
        const data = await response.json();
        setUserData(data);
      } catch (err) {
        setError("Error al obtener el perfil del usuario");
      }
    };

    fetchUserProfile();
  }, []);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`);
        if (!response.ok) {
          throw new Error("Error al obtener los productos");
        }
        const data = await response.json();
        setProducts(data.payload);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsProductsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Fetch cart products
  useEffect(() => {
    const fetchCartProducts = async () => {
      if (userData) {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/orders/${userData.id}`);
          if (!response.ok) {
            throw new Error("Error al obtener el carrito");
          }
          const data = await response.json();

          const updatedCartProducts = data.cart.map(cartItem => {
            const productInfo = products.find(product => product.sku === cartItem.sku);
            return {
              ...cartItem,
              name: productInfo?.name || "Producto no encontrado",
              price: productInfo?.price || 0,
            };
          });

          setCartProducts(updatedCartProducts);
        } catch (err) {
          console.error("Error al obtener el carrito:", err);
          setError("Error al obtener el carrito");
        } finally {
          setIsCartLoading(false);
        }
      }
    };

    if (products.length > 0 && userData) {
      fetchCartProducts();
    }
  }, [userData, products]);

  const removeProduct = async sku => {
    if (!userData) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/orders/${userData.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sku }),
      });

      if (!response.ok) {
        throw new Error("Error al eliminar el producto");
      }

      setCartProducts(prevCart => prevCart.filter(item => item.sku !== sku));
      toast.success("Producto eliminado del pedido");
    } catch (error) {
      setError("Error al eliminar el producto");
    }
  };

  const total = cartProducts.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const updateQuantity = (sku, newQuantity) => {
    setCartProducts(prevCart =>
      prevCart.map(item =>
        item.sku === sku ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  if (isCartLoading || isProductsLoading) {
    return <Loader />;
  }

  if (error) {
    return <p className="text-center text-red-500">Error: {error}</p>;
  }

  return (
    <main className="max-w-4xl mx-auto p-4">
      <section className="bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-4">Mi Pedido</h1>

        <div className="mb-2">
          <h2 className="text-xl font-semibold mb-2">Información del Usuario</h2>
          <p className="text-sm md:text-base">
            <strong>Nombre:</strong> {capitalizeFirstLetter(userData?.name)}
          </p>
          <p className="text-sm md:text-base">
            <strong>Apellido:</strong> {capitalizeFirstLetter(userData?.surname)}
          </p>
          <p className="text-sm md:text-base">
            <strong>Email:</strong> {userData?.email}
          </p>
          <p className="text-sm md:text-base">
            <strong>Teléfono:</strong> {userData?.whatsapp}
          </p>
          <p className="text-sm md:text-base">
            <strong>Dirección:</strong>{" "}
            {capitalizeFirstLetter(userData?.address)}, {capitalizeFirstLetter(userData?.city)}, {capitalizeFirstLetter(userData?.province)}, {capitalizeFirstLetter(userData?.country)}
          </p>
          <p className="text-sm md:text-base">
            <strong>CUIT:</strong> {userData?.cuit}
          </p>
          <p className="text-sm md:text-base">
            <strong>Razón Social:</strong> {capitalizeFirstLetter(userData?.businessName)}
          </p>
        </div>

        {cartProducts.length > 0 ? (
          <div>
            <h2 className="text-xl font-semibold">Orden</h2>
            <div className="flex flex-col divide-y divide-gray-200">
              {cartProducts.map(item => {
                const subtotal = item.price * item.quantity;
                return (
                  <div
                    key={item.sku}
                    className="flex flex-col items-center xxs:flex-row justify-between xxs:items-start py-4"
                  >
                    <div className="flex-1 flex flex-col text-center xxs:text-start">
                      <div className="font-medium text-sm md:text-base mb-1">
                        {capitalizeFirstLetter(item.name)}
                      </div>
                      <div className="text-xs md:text-sm text-gray-500 xxs:text-start">
                        {capitalizeFirstLetter(item.sku)}
                      </div>
                      <div className="text-xs md:text-sm text-gray-500">
                        Precio unitario: ${item.price.toFixed(2)}
                      </div>
                      <div className="flex items-center justify-center xxs:justify-start mt-1">
                        <button
                          className="text-red-500 mx-2"
                          onClick={() => updateQuantity(item.sku, Math.max(item.quantity - 1, 1))}
                        >
                          -
                        </button>
                        <span className="mx-2">{item.quantity}</span>
                        <button
                          className="text-green-500 mx-2"
                          onClick={() => updateQuantity(item.sku, item.quantity + 1)}
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-col xxs:flex-row items-center mt-2 md:mt-0">
                      <div className="text-sm md:text-base font-semibold text-green-600">
                        ${subtotal.toFixed(2)}
                      </div>
                      <button
                        onClick={() => removeProduct(item.sku)}
                        className="mt-2 text-red-500 hover:underline ml-4 flex items-center gap-1"
                      >
                        <TrashIcon /> Eliminar
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-between mt-4">
              <div className="font-semibold text-xl">Total: ${total.toFixed(2)}</div>
              {cartProducts.length > 0 && (
                <OrderButton
                  whatsappNumber="+5491154041650"
                  userData={userData}
                  cartProducts={cartProducts}
                  isOrderSent={isOrderSent}
                  setIsOrderSent={setIsOrderSent}
                />
              )}
            </div>
          </div>
        ) : (
          <p className="text-center text-lg text-gray-500">Tu carrito está vacío</p>
        )}
      </section>
    </main>
  );
}

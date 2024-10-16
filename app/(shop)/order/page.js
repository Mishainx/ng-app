"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { capitalizeFirstLetter } from "@/utils/stringsManager";
import TrashIcon from "@/icons/TrashIcon";
import Link from "next/link";

export default function Order() {
  const { userData, loading } = useAuth();
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [cartProducts, setCartProducts] = useState([]);
  const [isCartLoading, setIsCartLoading] = useState(true); // Para manejar el estado de carga del carrito
  const [isProductsLoading, setIsProductsLoading] = useState(true); // Para manejar el estado de carga de productos

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

  useEffect(() => {
    const fetchCartProducts = async () => {
      if (userData?.user) {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/orders/${userData.user.uid}`);
          if (!response.ok) {
            throw new Error("Error al obtener el carrito");
          }
          const data = await response.json();

          // Mapeo del carrito para combinar la información del producto con la cantidad del carrito
          const updatedCartProducts = data.cart.map(cartItem => {
            const productInfo = products.find(product => product.sku === cartItem.productSku);
            return {
              ...cartItem,
              name: productInfo?.name || "Producto no encontrado", // Si no encuentra el producto
              price: productInfo?.price || 0 // Precio por defecto en caso de que no esté disponible
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

    if (products.length > 0) { // Esperar a que los productos estén cargados antes de obtener el carrito
      fetchCartProducts();
    }
  }, [userData, products]);

  const removeProduct = async (productSku) => {
    if (!userData.user) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/orders/${userData.user.uid}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productSku }),
      });

      if (!response.ok) {
        throw new Error("Error al eliminar el producto");
      }

      setCartProducts(prevCart => prevCart.filter(item => item.productSku !== productSku));
    } catch (error) {
      setError("Error al eliminar el producto");
    }
  };

  const total = cartProducts.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const generateWhatsAppMessage = () => {
    if (!userData.user || cartProducts.length === 0) return "";

    let message = `*Pedido de ${capitalizeFirstLetter(userData.user.name)} ${capitalizeFirstLetter(userData.user.surname)}*\n\n`;

    message += "*Productos:\n*";
    cartProducts.forEach(item => {
      message += `${item.quantity} x ${capitalizeFirstLetter(item.name)} - $${item.price.toFixed(2)}\n`;
    });

    message += `\n*Total:* $${total.toFixed(2)}\n\n`;

    message += "*Información del usuario:*\n";
    message += `Nombre: ${capitalizeFirstLetter(userData.user.name)} ${capitalizeFirstLetter(userData.user.surname)}\n`;
    message += `Email: ${userData.user.email}\n`;
    message += `Teléfono: ${userData.user.whatsapp}\n`;
    message += `Dirección: ${capitalizeFirstLetter(userData.user.address)}, ${capitalizeFirstLetter(userData.user.city)}, ${capitalizeFirstLetter(userData.user.province)}, ${capitalizeFirstLetter(userData.user.country)}\n`;
    message += `CUIT: ${userData.user.cuit}\n`;
    message += `Razón Social: ${capitalizeFirstLetter(userData.user.businessName)}\n`;

    return encodeURIComponent(message);
  };

  const whatsappNumber = "+5491154041650"; // Número de WhatsApp

  if (loading || isCartLoading || isProductsLoading) {
    return <p className="text-center">Cargando...</p>;
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
          <p className="text-sm md:text-base"><strong>Nombre:</strong> {capitalizeFirstLetter(userData.user.name)}</p>
          <p className="text-sm md:text-base"><strong>Apellido:</strong> {capitalizeFirstLetter(userData.user.surname)}</p>
          <p className="text-sm md:text-base"><strong>Email:</strong> {userData.user.email}</p>
          <p className="text-sm md:text-base"><strong>Teléfono:</strong> {userData.user.whatsapp}</p>
          <p className="text-sm md:text-base"><strong>Dirección:</strong> {capitalizeFirstLetter(userData.user.address)}, {capitalizeFirstLetter(userData.user.city)}, {capitalizeFirstLetter(userData.user.province)}, {capitalizeFirstLetter(userData.user.country)}</p>
          <p className="text-sm md:text-base"><strong>CUIT:</strong> {userData.user.cuit}</p>
          <p className="text-sm md:text-base"><strong>Razón Social:</strong> {capitalizeFirstLetter(userData.user.businessName)}</p>
        </div>

        {cartProducts.length > 0 ? (
          <div>
            <h2 className="text-xl font-semibold">Orden</h2>
            <div className="flex flex-col divide-y divide-gray-200">
              {cartProducts.map(item => {
                const subtotal = item.price * item.quantity;
                return (
                  <div key={item.productSku} className="flex flex-col items-center xxs:flex-row justify-between xxs:items-start py-4">
                    <div className="flex-1 flex flex-col text-center xxs:text-start">
                      <div className="font-medium text-sm md:text-base mb-1">{capitalizeFirstLetter(item.name)}</div>
                      <div className="text-xs md:text-sm text-gray-500 xxs:text-start">{capitalizeFirstLetter(item.productSku)}</div>
                      <div className="text-xs md:text-sm text-gray-500">Precio unitario: ${item.price.toFixed(2)}</div>
                      <div className="flex items-center justify-center xxs:justify-start mt-1">
                        <button
                          className="text-red-500 mx-2"
                          onClick={() => updateQuantity(item.productSku, Math.max(item.quantity - 1, 1))}
                        >
                          -
                        </button>
                        <span className="mx-2">{item.quantity}</span>
                        <button
                          className="text-green-500 mx-2"
                          onClick={() => updateQuantity(item.productSku, item.quantity + 1)}
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-col xxs:flex-row items-center mt-2 md:mt-0">
                      <span className="text-lg font-bold text-red-600"> ${subtotal.toFixed(2)}</span>
                      <button
                        className="text-red-500 ml-2"
                        onClick={() => removeProduct(item.productSku)}
                      >
                        <TrashIcon className="text-center" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
            <h3 className="mt-4 text-lg md:text-xl font-bold">Total: ${total.toFixed(2)}</h3>
            <Link
              href={`https://wa.me/${whatsappNumber}?text=${generateWhatsAppMessage()}`}
              target="_blank"
            >
              <button className="mt-4 px-6 py-2 bg-green-500 text-white rounded-md shadow hover:bg-green-600 transition duration-200">
                Realizar pedido
              </button>
            </Link>
          </div>
        ) : (
          <p className="text-center text-gray-500 mt-4">No hay productos en el carrito.</p>
        )}
      </section>
    </main>
  );
}

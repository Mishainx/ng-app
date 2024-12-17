"use client";

import { useEffect, useState } from "react";
import { capitalizeFirstLetter } from "@/utils/stringsManager";
import TrashIcon from "@/icons/TrashIcon";
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
              discount: productInfo?.discount || 0,
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

  const total = cartProducts.reduce(
    (acc, item) => acc + (item.discount || item.price) * item.quantity,
    0
  );

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
      <section className="bg-white shadow-md rounded-lg p-4">
        <h1 className="text-xl font-bold mb-4">Mi Pedido</h1>

        {/* Información del usuario */}
        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2">Información del Usuario</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 text-sm">
            <p>
              <strong>Nombre:</strong> {capitalizeFirstLetter(userData?.name)}
            </p>
            <p>
              <strong>Apellido:</strong> {capitalizeFirstLetter(userData?.surname)}
            </p>
            <p>
              <strong>Email:</strong> {userData?.email}
            </p>
            <p>
              <strong>Teléfono:</strong> {userData?.whatsapp}
            </p>
            <p>
              <strong>Dirección:</strong>{" "}
              {capitalizeFirstLetter(userData?.address)}, {capitalizeFirstLetter(userData?.city)},{" "}
              {capitalizeFirstLetter(userData?.province)}, {capitalizeFirstLetter(userData?.country)}
            </p>
            <p>
              <strong>CUIT:</strong> {userData?.cuit}
            </p>
            <p>
              <strong>Razón Social:</strong> {capitalizeFirstLetter(userData?.businessName)}
            </p>
          </div>
        </div>

        {/* Detalle de la orden */}
        {cartProducts.length > 0 ? (
          <>
            <h2 className="text-lg font-semibold mb-2">Orden</h2>

            {/* Modo móvil: tarjetas */}
            <div className="block md:hidden">
              {cartProducts.map(item => {
                const effectivePrice = item.discount || item.price;
                const subtotal = effectivePrice * item.quantity;

                return (
                  <div key={item.sku} className="bg-gray-100 p-4 mb-4 rounded-lg shadow">
                    <div className="flex justify-between">
                      <h3 className="font-semibold">{capitalizeFirstLetter(item.name)}</h3>
                      <button
                        onClick={() => removeProduct(item.sku)}
                        className="text-red-500 flex items-center gap-1"
                      >
                        <TrashIcon /> Eliminar
                      </button>
                    </div>
                    <p><strong>SKU:</strong> {capitalizeFirstLetter(item.sku)}</p>
                    <p>
                      <strong>Precio:</strong> {item.discount ? (
                        <>
                          <span className="line-through text-gray-400 text-xs">${item.price.toFixed(2)}</span>
                          <span className="text-green-600 font-semibold ml-2">${item.discount.toFixed(2)}</span>
                        </>
                      ) : (
                        `$${item.price.toFixed(2)}`
                      )}
                    </p>
                    <div className="flex justify-between">
                      <div className="flex items-center">
                        <button
                          className="text-red-500 mx-1"
                          onClick={() => updateQuantity(item.sku, Math.max(item.quantity - 1, 1))}
                        >
                          -
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          className="text-green-500 mx-1"
                          onClick={() => updateQuantity(item.sku, item.quantity + 1)}
                        >
                          +
                        </button>
                      </div>
                      <p><strong>Subtotal:</strong> ${subtotal.toFixed(2)}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Modo desktop: tabla */}
            <div className="hidden md:block">
              <div className="overflow-x-auto">
                <table className="min-w-full table-auto border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="px-4 py-2 text-left text-sm">Producto</th>
                      <th className="px-4 py-2 text-left text-sm">SKU</th>
                      <th className="px-4 py-2 text-center text-sm">Precio</th>
                      <th className="px-4 py-2 text-center text-sm">Cantidad</th>
                      <th className="px-4 py-2 text-center text-sm">Subtotal</th>
                      <th className="px-4 py-2 text-center text-sm">Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartProducts.map(item => {
                      const effectivePrice = item.discount || item.price;
                      const subtotal = effectivePrice * item.quantity;

                      return (
                        <tr key={item.sku} className="border-t">
                          <td className="px-4 py-2 text-sm">{capitalizeFirstLetter(item.name)}</td>
                          <td className="px-4 py-2 text-sm">{capitalizeFirstLetter(item.sku)}</td>
                          <td className="px-4 py-2 text-center text-sm">
                          {item.discount ? (
  <div className="flex flex-col items-center">
    <span className="line-through text-gray-400 text-xs">
      {`U$D ${item.price.toFixed(2)}`}
    </span>
    <span className="text-green-600 font-semibold">
      {`U$D ${item.discount.toFixed(2)}`}
    </span>
  </div>
) : (
  `U$D ${item.price.toFixed(2)}`
)}

                          </td>
                          <td className="px-4 py-2 text-center">
                            <div className="flex items-center justify-center">
                              <button
                                className="text-red-500 mx-1"
                                onClick={() => updateQuantity(item.sku, Math.max(item.quantity - 1, 1))}
                              >
                                -
                              </button>
                              <span>{item.quantity}</span>
                              <button
                                className="text-green-500 mx-1"
                                onClick={() => updateQuantity(item.sku, item.quantity + 1)}
                              >
                                +
                              </button>
                            </div>
                          </td>
                          <td className="px-4 py-2 text-center text-sm font-semibold text-green-600">
                            U$D {subtotal.toFixed(2)}
                          </td>
                          <td className="px-4 py-2 text-center">
                            <button
                              onClick={() => removeProduct(item.sku)}
                              className="text-red-500 hover:underline flex items-center gap-1"
                            >
                              <TrashIcon /> Eliminar
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex justify-between mt-4">
              <div className="font-semibold text-lg">Total: U$D {total.toFixed(2)}</div>
              <OrderButton
                whatsappNumber="+5491164316975"
                userData={userData}
                cartProducts={cartProducts}
                isOrderSent={isOrderSent}
                setIsOrderSent={setIsOrderSent}
              />
            </div>
          </>
        ) : (
          <p className="text-center text-sm text-gray-500">Tu carrito está vacío</p>
        )}
      </section>
    </main>
  );
}

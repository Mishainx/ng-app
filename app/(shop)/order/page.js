"use client";

import { useEffect, useState } from "react";
import { capitalizeFirstLetter } from "@/utils/stringsManager";
import TrashIcon from "@/icons/TrashIcon";
import Link from "next/link";

export default function Order() {
  const [userData, setUserData] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartProducts, setCartProducts] = useState([]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/profile`, {
          method: "GET",
        });

        if (!response.ok) {
          throw new Error("Error al obtener los datos del perfil");
        }

        const data = await response.json();
        setUserData(data);
      } catch (err) {
        console.log("el error es aqui")
        setError(err.message);
      }
    };

    fetchUserProfile();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`);
        if (!response.ok) {
          throw new Error("Error al obtener los productos");
        }
  
        const data = await response.json();
        setProducts(data.payload); // Aquí deberías recibir los productos con sus precios
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
  
    fetchProducts();
  }, []);
  

  useEffect(() => {
    const getCartProducts = () => {
      if (!userData) return [];
      return userData.cart.map(item => {
        const product = products?.find(prod => prod.sku === item.productSku); // Buscar el producto por SKU en los productos obtenidos
        return {
          ...item,
          price: product ? product.price : 0, // Asegurarse de que el precio se obtenga del producto correcto
          name: product ? product.name : item.productSku, // Usar el nombre del producto si existe
        };
      });
    };
  
    if (userData && products.length > 0) {
      setCartProducts(getCartProducts()); // Actualizar los productos del carrito cuando se tengan los datos
    }
  }, [userData, products]);
  

  // Actualizar cantidad de productos en el carrito
  const updateQuantity = (productSku, newQuantity) => {
    setCartProducts(prevCart =>
      prevCart.map(item =>
        item.productSku === productSku
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  // Eliminar producto del carrito
  const removeProduct = (productSku) => {
    setCartProducts(prevCart => prevCart.filter(item => item.productSku !== productSku));
  };

  // Calcular total
  const total = cartProducts.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // Generar el mensaje para WhatsApp
  const generateWhatsAppMessage = () => {
    if (!userData || cartProducts.length === 0) return "";
    
    let message = `*Pedido de ${capitalizeFirstLetter(userData.name)} ${capitalizeFirstLetter(userData.surname)}*\n\n`;
    
    message += "*Productos:\n*";
    cartProducts.forEach(item => {
      message += `${item.quantity} x ${capitalizeFirstLetter(item.name)} - $${item.price.toFixed(2)}\n`;
    });
    
    message += `\n*Total:* $${total.toFixed(2)}\n\n`;
    
    message += "*Información del usuario:*\n";
    message += `Nombre: ${capitalizeFirstLetter(userData.name)} ${capitalizeFirstLetter(userData.surname)}\n`;
    message += `Email: ${userData.email}\n`;
    message += `Teléfono: ${userData.whatsapp}\n`;
    message += `Dirección: ${capitalizeFirstLetter(userData.address)}, ${capitalizeFirstLetter(userData.city)}, ${capitalizeFirstLetter(userData.province)}, ${capitalizeFirstLetter(userData.country)}\n`;
    message += `CUIT: ${userData.cuit}\n`;
    message += `Razón Social: ${capitalizeFirstLetter(userData.businessName)}\n`;

    return encodeURIComponent(message);
  };

  const whatsappNumber = "+5491154041650"; // Número de WhatsApp

  if (loading) return <p className="text-center">Cargando...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <main className="max-w-4xl mx-auto p-4">
      <section className="bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-4">Mi Pedido</h1>

        <div className="mb-2">
          <h2 className="text-xl font-semibold mb-2">Información del Usuario</h2>
          <p className="text-sm md:text-base"><strong>Nombre:</strong> {capitalizeFirstLetter(userData.name)}</p>
          <p className="text-sm md:text-base"><strong>Apellido:</strong> {capitalizeFirstLetter(userData.surname)}</p>
          <p className="text-sm md:text-base"><strong>Email:</strong> {userData.email}</p>
          <p className="text-sm md:text-base"><strong>Teléfono:</strong> {userData.whatsapp}</p>
          <p className="text-sm md:text-base"><strong>Dirección:</strong> {capitalizeFirstLetter(userData.address)}, {capitalizeFirstLetter(userData.city)}, {capitalizeFirstLetter(userData.province)}, {capitalizeFirstLetter(userData.country)}</p>
          <p className="text-sm md:text-base"><strong>CUIT:</strong> {userData.cuit}</p>
          <p className="text-sm md:text-base"><strong>Razón Social:</strong> {capitalizeFirstLetter(userData.businessName)}</p>
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
                      <div className=" font-medium text-sm md:text-base mb-1">{capitalizeFirstLetter(item.name)}</div>
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

import { useState } from "react";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { capitalizeFirstLetter } from "@/utils/stringsManager";
import SpinnerIcon from "@/icons/SpinnerIcon";

const buildOrderDetails = (userData, cartProducts, total) => {
  return {
    destinatary: userData.email,
    order: {
      userName: `${capitalizeFirstLetter(userData.name)} ${capitalizeFirstLetter(userData.surname)}`,
      products: cartProducts.map(item => ({
        name: capitalizeFirstLetter(item.name),
        quantity: item.quantity,
        price: item.price.toFixed(2),
        subtotal: (item.price * item.quantity).toFixed(2),
      })),
      total: total.toFixed(2),
      userInfo: {
        name: capitalizeFirstLetter(userData.name),
        surname: capitalizeFirstLetter(userData.surname),
        email: userData.email,
        whatsapp: userData.whatsapp,
        address: `${capitalizeFirstLetter(userData.address)}, ${capitalizeFirstLetter(userData.city)}, ${capitalizeFirstLetter(userData.province)}, ${capitalizeFirstLetter(userData.country)}`,
        cuit: userData.cuit,
        businessName: capitalizeFirstLetter(userData.businessName),
      },
    },
  };
};

export default function OrderButton({ userData, cartProducts, isOrderSent, setIsOrderSent, setCartProducts }) {
  const [isLoading, setIsLoading] = useState(false); // Estado de carga
  const total = cartProducts.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handlePlaceOrder = async () => {
    if (isOrderSent || !userData || cartProducts.length === 0) {
      toast.warning("No hay productos en el pedido o el pedido ya fue enviado.");
      return;
    }

    setIsLoading(true); // Activar el spinner

    try {
      const orderDetails = buildOrderDetails(userData, cartProducts, total);

      // Primero, creamos el ticket en la API
      const ticketResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tickets`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: userData.email,
          products: cartProducts.map(item => ({
            sku: item.sku,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            discount: item.discount,
          })),
        }),
      });

      if (!ticketResponse.ok) {
        throw new Error("Error al crear el ticket. Por favor, intenta nuevamente.");
      }

      const ticketData = await ticketResponse.json();
      const ticketId = ticketData.id;  // Obtenemos el ID del ticket

      // Ahora, enviamos el correo con los detalles del pedido, incluyendo el ticket ID
      const emailResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/email/send-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...orderDetails,
          ticketId,  // Añadimos el ticket ID al correo
        }),
      });

      if (!emailResponse.ok) {
        throw new Error("Error al enviar el correo. Por favor, intenta nuevamente.");
      }

      setIsOrderSent(true); // Marca el pedido como enviado

      // Crear el mensaje de WhatsApp
      const whatsappMessage = `
      *Detalles del Pedido:*
      *Nombre:* ${orderDetails.order.userName}
      *Correo Electrónico:* ${orderDetails.order.userInfo.email}
      *Teléfono:* ${orderDetails.order.userInfo.whatsapp}
      *Dirección:* ${orderDetails.order.userInfo.address}
      
      *Productos:*
      ${orderDetails.order.products.map(item => `${item.name} x${item.quantity} - $${item.subtotal}`).join('\n')}
      
      *Total:* $${orderDetails.order.total}
      
      Si necesitas más información o tienes alguna consulta, ¡envíanos un mensaje!
      `;

      // Hacer un fetch a la API para eliminar el carrito del usuario
      const deleteCartResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/orders/${userData.id}/delete`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!deleteCartResponse.ok) {
        throw new Error("Error al eliminar el carrito. Por favor, intenta nuevamente.");
      }


      // Mostrar el modal de éxito con el botón para WhatsApp
      Swal.fire({
        icon: "success",
        title: "Pedido Realizado",
        html: `
          <p>Tu pedido se ha generado exitosamente. A la brevedad uno de nuestros representantes se estará comunicando o si lo deseas puedes enviarnos un whatsapp a ventas.</p>
        `,
        confirmButtonText: "Aceptar",
        confirmButtonColor: "#3085d6",
        showCancelButton: true,
        cancelButtonText: "Enviar WhatsApp",
        cancelButtonColor: "#25D366", // Color verde típico de WhatsApp
        preConfirm: () => {
          // Esto solo se ejecutará si el usuario hace clic en "Aceptar"
          window.location.href = "/"; // Redirige al home
        },
        didClose: () => {
          // Esto solo se ejecutará si el usuario hace clic en "Enviar WhatsApp"
          const whatsappLink = `https://wa.me/+5491164316975?text=${encodeURIComponent(whatsappMessage)}`;
          window.open(whatsappLink, "_blank");
        },
      });

    } catch (error) {
      console.error("Error al realizar el pedido:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Ocurrió un error al realizar el pedido. Por favor, intenta nuevamente.",
        confirmButtonText: "Aceptar",
        confirmButtonColor: "#d33",
      });
    } finally {
      setIsLoading(false); // Desactivar el spinner
    }
  };

  return (
    <button
      onClick={handlePlaceOrder}
      disabled={isOrderSent || isLoading} // Deshabilitar el botón mientras se procesa la orden
      className={`px-4 py-2 rounded font-bold text-white ${isOrderSent || isLoading ? "bg-gray-300 cursor-not-allowed" : "bg-red-600 hover:bg-red-700"}`}
    >
      {isLoading ? (
        <div className="flex justify-center items-center">
          <SpinnerIcon className="animate-spin h-5 w-5 mr-2" /> {/* Spinner con animación */}
          Enviando...
        </div>
      ) : isOrderSent ? (
        "Pedido Enviado"
      ) : (
        "Realizar Pedido"
      )}
    </button>
  );
}

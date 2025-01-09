import { useState } from "react";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { capitalizeFirstLetter } from "@/utils/stringsManager";
import SpinnerIcon from "@/icons/SpinnerIcon";

// Construcción de los detalles de la orden
const buildOrderDetails = (userData, cartProducts, total) => {
  return {
    destinatary: userData.email,
    order: {
      userName: `${capitalizeFirstLetter(userData.name)} ${capitalizeFirstLetter(userData.surname)}`,
      products: cartProducts.map(item => {
        const price = Number(item.price) || 0;
        const discount = item.discount ? Number(item.discount) : null;
        const subtotal = discount
          ? (discount * item.quantity).toFixed(2)
          : (price * item.quantity).toFixed(2);

        return {
          name: capitalizeFirstLetter(item.name),
          quantity: item.quantity,
          price: price.toFixed(2),
          discount: discount ? discount.toFixed(2) : null,
          subtotal,
        };
      }),
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
  const [isLoading, setIsLoading] = useState(false);

  // Calcular el total considerando descuentos
  const total = cartProducts.reduce((acc, item) => {
    const priceToUse = item.discount > 0 ? Number(item.discount) : Number(item.price);
    return acc + priceToUse * item.quantity;
  }, 0);

  const handlePlaceOrder = async () => {
    if (isOrderSent || !userData || cartProducts.length === 0) {
      toast.warning("No hay productos en el pedido o el pedido ya fue enviado.");
      return;
    }

    setIsLoading(true);

    try {
      const orderDetails = buildOrderDetails(userData, cartProducts, total);

      // Crear ticket en la API
      const ticketResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tickets`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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

      if (!ticketResponse.ok) throw new Error("Error al crear el ticket. Por favor, intenta nuevamente.");
      const ticketData = await ticketResponse.json();
      const ticketId = ticketData.id;

      // Enviar correo con los detalles del pedido
      const emailResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/email/send-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...orderDetails, ticketId }),
      });

      if (!emailResponse.ok) throw new Error("Error al enviar el correo. Por favor, intenta nuevamente.");

      setIsOrderSent(true);

      // Crear el mensaje de WhatsApp
      const whatsappMessage = `
      *Detalles del Pedido:*
      *Nombre:* ${orderDetails.order.userName}
      *Correo Electrónico:* ${orderDetails.order.userInfo.email}
      *Teléfono:* ${orderDetails.order.userInfo.whatsapp}
      *Dirección:* ${orderDetails.order.userInfo.address}
      
      *Productos:*
      ${orderDetails.order.products
        .map(item => {
          if (item.discount && Number(item.discount) > 0) {
            return `🔹 *${item.name}*  
         Cantidad: ${item.quantity}  
         Precio Original: ~USD$${item.price}~  
         Precio con Descuento: *USD$${item.discount}*  
         Subtotal: *USD$${item.subtotal}*`;
          }
          return `🔹 *${item.name}*  
         Cantidad: ${item.quantity}  
         Precio: USD$${item.price}  
         Subtotal: *USD$${item.subtotal}*`;
        })
        .join('\n\n')}
      
      *Total:* *USD$${orderDetails.order.total}*
      
      Si necesitas más información o tienes alguna consulta, ¡envíanos un mensaje!
      `;
      
      // Eliminar el carrito del usuario
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/orders/${userData.id}/delete`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      // Modal de éxito con opción de WhatsApp
      Swal.fire({
        icon: "success",
        title: "Pedido Realizado",
        html: `
<p style="font-size: 14px; line-height: 1.5; margin: 0;">
  Tu pedido se ha generado exitosamente. Actualmente nos encontramos de vacaciones y los pedidos serán procesados a partir del <strong>03 de febrero de 2025</strong>. Un operador se estará comunicando contigo en cuanto sea posible.
</p>
        `,
        confirmButtonText: "Aceptar",
        confirmButtonColor: "#d9534f", // Rojo
        showCancelButton: true,
        cancelButtonText: "Enviar WhatsApp",
        cancelButtonColor: "#25D366",
        preConfirm: () => (window.location.href = "/"),
        didClose: () => {
          const whatsappLink = `https://wa.me/+5491164316975?text=${encodeURIComponent(whatsappMessage)}`;
          window.open(whatsappLink, "_blank");
        },
        customClass: {
          confirmButton: 'swal2-confirm swal2-styled', // Cambia la clase de confirmButton si quieres aplicar más estilos
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
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handlePlaceOrder}
      disabled={isOrderSent || isLoading}
      className={`px-4 py-2 rounded font-bold text-white ${isOrderSent || isLoading ? "bg-gray-300 cursor-not-allowed" : "bg-red-600 hover:bg-red-700"}`}
    >
      {isLoading ? (
        <div className="flex justify-center items-center">
          <SpinnerIcon className="animate-spin h-5 w-5 mr-2" />
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

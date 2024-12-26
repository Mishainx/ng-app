import { useState } from "react";
import EyeIcon from "@/icons/EyeIcon";

export default function TicketRow({ ticket }) {
  const [isOpen, setIsOpen] = useState(false);

  const closeModal = () => setIsOpen(false);
  const openModal = () => setIsOpen(true);

  return (
    <>
      <tr>
        <td className="px-4 py-2 text-sm font-medium text-gray-700 text-start">{ticket.id}</td>
        <td className="px-4 py-2 text-sm text-gray-800 text-start">${ticket.totalAmount.toFixed(2)}</td>
        <td className="px-4 py-2 text-sm text-gray-600 text-start">{new Date(ticket.date.seconds * 1000).toLocaleDateString()}</td>
        <td className="px-4 py-2 text-sm text-gray-600 text-start">
          <button
            className="text-white font-medium p-2 rounded-md"
            onClick={openModal}
          >
            <EyeIcon className="w-6 h-6 text-gray-700 hover:text-red-500" />
          </button>
        </td>
      </tr>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-4 sm:max-w-md lg:max-w-3xl w-full shadow-xl">
            <h2 className="text-xl font-semibold mb-3">Detalles del Ticket {ticket.id}</h2>

            <div className="space-y-3">
              <div className="">
                <p className="text-sm font-medium text-gray-600">Fecha: {new Date(ticket.date.seconds * 1000).toLocaleDateString()}</p>
                <p className="text-sm font-medium text-gray-600">Monto Total: $ {ticket.totalAmount.toFixed(2)}</p>
                <p className="text-sm font-medium text-gray-600">Cancelado: {ticket.canceled ? "Sí" : "No"}</p>
              </div>

              <h3 className="text-lg font-semibold text-gray-700 mt-4">Productos:</h3>
              <table className="min-w-full table-auto divide-y divide-gray-200 mt-2">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">SKU</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Producto</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Cantidad</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Precio</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Precio con Descuento</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {ticket.products.map((product, index) => {
                    const priceWithDiscount = product.discount;
                    const subtotal = priceWithDiscount * product.quantity;
                    return (
                      <tr key={index}>
                        <td className="px-4 py-2 text-sm text-gray-800 text-start">{product.sku}</td>
                        <td className="px-4 py-2 text-sm text-gray-800 text-start">{product.name}</td>
                        <td className="px-4 py-2 text-sm text-gray-800 text-start">{product.quantity}</td>
                        <td className="px-4 py-2 text-sm text-gray-800 text-start">
                          {product.discount > 0 ? (
                            <span className="line-through text-red-500">${product.price.toFixed(2)}</span>
                          ) : (
                            `$${product.price.toFixed(2)}`
                          )}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-800 text-start">
                          {product.discount > 0
                            ? `$${priceWithDiscount.toFixed(2)}`
                            : "-"}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-800 text-start">${subtotal.toFixed(2)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="mt-4 flex justify-end">
              <button
                onClick={closeModal}
                className="bg-gray-400 text-white py-2 px-4 rounded-md hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

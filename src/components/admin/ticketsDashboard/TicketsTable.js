import TrashIcon from "@/icons/TrashIcon";
import EditIcon from "@/icons/EditIcon";
import { useTickets } from "@/context/TicketsContext";
import { useClients } from "@/context/ClientsContext";
import { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ArchiveIcon from "@/icons/ArchiveIcon";
import MoneyIcon from "@/icons/MoneyIcon";
import React from "react";
import { capitalizeFirstLetter } from "@/utils/stringsManager";
import SpinnerIcon from "@/icons/SpinnerIcon";
import WhatsappIcon from "@/icons/WhatsappIcon";

const TicketTable = ({ handleViewChange, searchTerm }) => {
  const { tickets, deleteTicket, archiveTicket,updatePaymentStatus } = useTickets();
  const { clients } = useClients();
  const [activeTab, setActiveTab] = useState("pending"); // Tab activo: 'pending' o 'processed'
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedTicket, setExpandedTicket] = useState(null);

  const getClientInfo = (ticket) => {
    return clients.find((client) => client.email === ticket.email);
  };

  const getTotalAmount = (ticket) => {
    return ticket.products.reduce((total, product) => {
      // Si el producto tiene descuento, usamos el precio con descuento
      const priceToUse = product.discount != null ? product.discount : product.price;
      return total + (priceToUse * product.quantity);
    }, 0);
  };

  const filteredTickets = tickets.filter((ticket) =>
    // Filtrar según la pestaña activa
    (activeTab === "pending" ? ticket.processed === false : ticket.processed === true) &&
  
    // Filtrado por el término de búsqueda
    (searchTerm.length >= 3
      ? Object.values(ticket).some((value) => {
          // Comprobación si el valor es una fecha (con el formato de Firebase: { seconds, nanoseconds })
          if (value?.seconds && value?.nanoseconds) {
            // Convertir la fecha desde el formato Firebase a un objeto Date
            const ticketDate = new Date(value.seconds * 1000); // Convertir segundos a milisegundos
            
            // Comparar la fecha con el término de búsqueda, permitiendo la búsqueda en formato de fecha
            return ticketDate.toLocaleDateString().toLowerCase().includes(searchTerm.toLowerCase());
          }
          
          // Si no es una fecha, se realiza la búsqueda normal
          return String(value).toLowerCase().includes(searchTerm.toLowerCase());
        })
      : true)
  );

  const totalPages = Math.ceil(filteredTickets.length / itemsPerPage);
  const paginatedTickets = filteredTickets.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const toggleExpandTicket = (ticketId) => {
    setExpandedTicket((prev) => (prev === ticketId ? null : ticketId));
  };

  const handleDeleteTicket = async (ticketId) => {
    if (confirm("¿Estás seguro de que quieres eliminar este ticket?")) {
      try {
        await deleteTicket(ticketId);
        toast.success("Ticket eliminado con éxito.");
      } catch (error) {
        console.error("Error al eliminar el ticket:", error);
        toast.error("Error al eliminar el ticket. Intenta nuevamente.");
      }
    }
  };

  const changeTab = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1); // Reiniciar paginación al cambiar de pestaña
  };

  const handleArchiveTicket = async (ticketId, e) => {
    e.stopPropagation(); // Evitar que se propague el evento
    
    const ticket = tickets.find((t) => t.id === ticketId);
    const action = ticket.processed ? "desarchivar" : "archivar";
    const actionMessage = action === "archivar" ? "archivado" : "desarchivado";

    if (confirm(`¿Estás seguro de que quieres ${action} este ticket?`)) {
      try {
        await archiveTicket(ticketId);
        toast.success(`Ticket ${actionMessage} con éxito.`);
      } catch (error) {
        console.error("Error al archivar o desarchivar el ticket:", error);
        toast.error(`Error al ${action} el ticket. Intenta nuevamente.`);
      }
    }
  };

  const handlePaymentStatusChange = async (ticketId) => {
    const ticket = tickets.find((t) => t.id === ticketId);
    const newStatus = ticket.paymentStatus ? false : true; // Cambiar el estado entre true y false
    
    try {
      await updatePaymentStatus(ticketId, newStatus); // Función que actualiza el estado de pago
      toast.success(`Estado de pago actualizado a ${newStatus ? 'Pagado' : 'No Pagado'}.`);
    } catch (error) {
      console.error("Error al actualizar el estado de pago:", error);
      toast.error("Error al cambiar el estado de pago. Intenta nuevamente.");
    }
  };

  return (
    <div>
      {/* Tabs */}
      <div className="flex space-x-4 mb-4">
        <button
          className={`px-4 py-2 rounded-md ${
            activeTab === "pending" ? "bg-red-500 text-white" : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => changeTab("pending")}
        >
          Tickets Pendientes
        </button>
        <button
          className={`px-4 py-2 rounded-md ${
            activeTab === "processed" ? "bg-red-500 text-white" : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => changeTab("processed")}
        >
          Tickets Finalizados
        </button>
      </div>
{/* Tabla de tickets en desktop */}
<div className="hidden sm:block overflow-x-auto text-xs">
  <table className="min-w-full bg-white border border-gray-300 text-sm rounded-md shadow-lg">
    <thead>
      <tr className="bg-gray-100 border-b border-gray-300">
        <th className="py-3 px-4 text-left">ID</th>
        <th className="py-3 px-4 text-left">Email</th>
        <th className="py-3 px-4 text-left">Estado de Pago</th>
        <th className="py-3 px-4 text-left">Fecha de Creación</th>
        <th className="py-3 px-4 text-center">Acciones</th>
      </tr>
    </thead>
    <tbody>
      {paginatedTickets.length > 0 ? (
        paginatedTickets.map((ticket) => (
          <React.Fragment key={ticket.id}>
            <tr
              onClick={() => toggleExpandTicket(ticket.id)}
              className={`border-b border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer ${expandedTicket === ticket.id ? "bg-gray-100" : ""}`}
            >
              <td className="py-2 px-4">{ticket.id}</td>
              <td className="py-2 px-4">{ticket.email}</td>
              <td className="py-2 px-4">
                <div className="flex items-center">
                  <span>{ticket.paymentStatus ? "Pagado" : "No Pagado"}</span>
                </div>
              </td>
              <td className="py-2 px-4">
                {ticket.date ? new Date(ticket.date.seconds * 1000).toLocaleString() : "Fecha no disponible"}
              </td>
              <td className="py-2 px-4 flex justify-center space-x-2">
                {/* Botón de Cambiar Estado de Pago */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePaymentStatusChange(ticket.id);
                  }}
                  className="text-purple-500 hover:text-purple-700 transition"
                >
                  <MoneyIcon className="w-5 h-5" />
                </button>
                {/* Botón de WhatsApp */}
                <button>
                  <a
                    href={`https://wa.me/${getClientInfo(ticket)?.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-500 hover:text-green-700 transition"
                  >
                    <WhatsappIcon className="w-5 h-5" />
                  </a>
                </button>

                {/* Botón de Editar */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewChange("edit", ticket);
                  }}
                  className="text-yellow-500 hover:text-yellow-700 transition"
                  aria-label={`Editar ticket ${ticket.id}`}
                >
                  <EditIcon className="w-5 h-5" />
                </button>

                {/* Botón de Archivar */}
                <button
                  onClick={(e) => handleArchiveTicket(ticket.id, e)}
                  className="text-blue-500 hover:text-blue-700 transition"
                >
                  <ArchiveIcon width="20" height="20" />
                </button>

                {/* Botón de Eliminar */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteTicket(ticket.id);
                  }}
                  className="text-red-500 hover:text-red-700 transition"
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
              </td>
            </tr>

            {/* Información adicional del ticket */}
            {expandedTicket === ticket.id && (
              <tr>
                <td colSpan="5" className="py-4 px-4 bg-gray-50">
                  <div>
                    <p><strong>Detalles del Ticket:</strong></p>
                    <p><strong>Descripción:</strong> {ticket.description || "No disponible"}</p>
                    <p><strong>Cliente:</strong> {getClientInfo(ticket)?.name || "No encontrado"}</p>
                    <p><strong>Email del Cliente:</strong> {ticket.email}</p>
                    <p><strong>Dirección:</strong> {getClientInfo(ticket)?.address || "No disponible"}</p>
                    <p><strong>Ciudad:</strong> {getClientInfo(ticket)?.city || "No disponible"}</p>
                    <p><strong>Provincia:</strong> {getClientInfo(ticket)?.province || "No disponible"}</p>
                    <p><strong>CUIT:</strong> {getClientInfo(ticket)?.cuit || "No disponible"}</p>
                    <p><strong>Whatsapp:</strong> {getClientInfo(ticket)?.whatsapp || "No disponible"}</p>

                    {/* Detalle de productos */}
                    <table className="min-w-full mt-4 border-collapse">
                      <thead>
                        <tr className="bg-gray-200">
                          <th className="py-2 px-4 text-left">Producto</th>
                          <th className="py-2 px-4 text-left">Cantidad</th>
                          <th className="py-2 px-4 text-left">Precio Unitario</th>
                          <th className="py-2 px-4 text-left">Precio con descuento</th>

                          <th className="py-2 px-4 text-left">Subotal</th>
                        </tr>
                      </thead>
                      <tbody>
                        {ticket.products.map((product, index) => (
                          <tr key={index}>
                            <td className="py-2 px-4">{product.sku} <br />{capitalizeFirstLetter(product.name)}</td>
                            <td className="py-2 px-4">{product.quantity}</td>
                            <td className="py-2 px-4">U$D {product.price.toFixed(2)}</td>
                            <td className="py-2 px-4">
                            {product?.discount == null || product?.discount === 0 ? "-" : `U$D ${product?.discount.toFixed(2)}`}
                            </td>
                            <td className="py-2 px-4">
                            U$D {(product.quantity * (product.discount != null ? product.discount : product.price)).toFixed(2)}

                            </td>
                            
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    {/* Total de la factura */}
                    <div className="flex justify-end mt-4 font-bold text-xl">
                      Total: U$D {getTotalAmount(ticket).toFixed(2)}
                    </div>
                  </div>
                </td>
              </tr>
            )}
          </React.Fragment>
        ))
      ) : (
        <tr>
          <td colSpan="5" className="py-4 px-4 text-center text-gray-500">
            No se encontraron tickets
          </td>
        </tr>
      )}
    </tbody>
  </table>
</div>


{/* Tickets en formato de tarjeta (para mobile) */}
<div className="block sm:hidden">
  {paginatedTickets.length > 0 ? (
    paginatedTickets.map((ticket) => (
      <div
        key={ticket.id}
        className="bg-white shadow-md rounded-md p-4 mb-4 border border-gray-300 cursor-pointer"
        onClick={() => toggleExpandTicket(ticket.id)}
      >
        <div className="flex justify-between items-center">
          <div>
            <strong>ID:</strong> {ticket.id}
          </div>
        </div>
        <div className="mt-2">
          <strong>Email:</strong> {ticket.email}
        </div>
        <div className="mt-2">
          <strong>Estado:</strong>{ticket.paymentStatus ? "Pagado" : "No Pagado"}
        </div>
        <div className="mt-2">
          <strong>Fecha de Creación:</strong> {ticket.date ? new Date(ticket.date.seconds * 1000).toLocaleString() : "Fecha no disponible"}
        </div>

        {/* Botones de acción dentro de la tarjeta */}
        <div className="flex justify-end space-x-2 mt-4">
          
                                    {/* Botón de Cambiar Estado de Pago */}
                                    <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePaymentStatusChange(ticket.id);
                        }}
                        className="text-purple-500 hover:text-purple-700 transition"
                      >
                        <MoneyIcon className="w-5 h-5" />
                      </button>
          <button>
            <a
              href={`https://wa.me/${getClientInfo(ticket)?.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-500 hover:text-green-700 transition"
            >
              <WhatsappIcon className="w-5 h-5" />
            </a>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleViewChange("edit", ticket);
            }}
            className="text-yellow-500 hover:text-yellow-700 transition"
            aria-label={`Editar ticket ${ticket.id}`}
          >
            <EditIcon className="w-5 h-5" />
          </button>

          <button
            onClick={(e) => handleArchiveTicket(ticket.id, e)}
            className="text-blue-500 hover:text-blue-700 transition"
          >
            <ArchiveIcon width="20" height="20" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteTicket(ticket.id);
            }}
            className="text-red-500 hover:text-red-700 transition"
          >
            <TrashIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Detalles del ticket */}
        {expandedTicket === ticket.id && (
          <div className="mt-4">
            <p><strong>Descripción:</strong> {ticket.description || "No disponible"}</p>
            <p><strong>Cliente:</strong> {getClientInfo(ticket)?.name || "No encontrado"}</p>
            <p><strong>Dirección:</strong> {getClientInfo(ticket)?.address || "No disponible"}</p>
            <p><strong>Ciudad:</strong> {getClientInfo(ticket)?.city || "No disponible"}</p>
            <p><strong>Whatsapp:</strong> {getClientInfo(ticket)?.whatsapp || "No disponible"}</p>

            {/* Detalle de productos */}
            <table className="min-w-full mt-4">
              <thead>
                <tr className="bg-gray-200">
                  <th className="py-2 px-4 text-left">Producto</th>
                  <th className="py-2 px-4 text-left">Cantidad</th>
                  <th className="py-2 px-4 text-left">Precio</th>
                  <th className="py-2 px-4 text-left">Descuento</th>
                </tr>
              </thead>
              <tbody>
                {ticket.products.map((product, index) => (
                  <tr key={index}>
                    <td className="py-2 px-4">{capitalizeFirstLetter(product.name)}</td>
                    <td className="py-2 px-4">{product.quantity}</td>
                    <td className="py-2 px-4">U$D {product.price.toFixed(2)}</td>
                    <td className="py-2 px-4">
                            {product?.discount == null || product?.discount === 0 ? "-" : `U$D ${product?.discount.toFixed(2)}`}                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Total de la factura */}
            <div className="font-bold text-xl mt-4">
              Total: U$D {getTotalAmount(ticket).toFixed(2)}
            </div>
          </div>
        )}
      </div>
    ))
  ) : (
    <div className="text-center text-gray-500">No se encontraron tickets</div>
  )}
</div>




      {/* Paginación */}
      {filteredTickets.length > itemsPerPage && (
        <div className="mt-4 flex justify-between items-center">
          <p className="text-sm text-gray-700">
            Página {currentPage} de {totalPages || 1}
          </p>
          <div className="flex space-x-2 text-xs">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              className="bg-gray-200 text-gray-700 rounded-md px-4 py-2 hover:bg-gray-300 transition"
              disabled={currentPage === 1}
            >
              Anterior
            </button>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              className="bg-gray-200 text-gray-700 rounded-md px-4 py-2 hover:bg-gray-300 transition"
              disabled={currentPage === totalPages}
            >
              Siguiente
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TicketTable;

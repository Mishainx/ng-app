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
import WhatsappIcon from "@/icons/WhatsappIcon";

const TicketTable = ({ handleViewChange, searchTerm }) => {
  const { tickets, deleteTicket, archiveTicket } = useTickets();
  const { clients } = useClients();
  const [activeTab, setActiveTab] = useState("pending"); // Tab activo: 'pending' o 'processed'
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedTicket, setExpandedTicket] = useState(null);

  const getClientInfo = (ticket) => {
    return clients.find((client) => client.email === ticket.email);
  };

  const getTotalAmount = (ticket) => {
    return ticket.products.reduce((total, product) => total + (product.price * product.quantity), 0);
  };

  const filteredTickets = tickets.filter(
    (ticket) =>
      ticket.processed === (activeTab === "processed") &&
      (searchTerm.length >= 3
        ? Object.values(ticket).some((value) =>
            String(value).toLowerCase().includes(searchTerm.toLowerCase())
          )
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

  return (
    <div>
      {/* Tabs */}
      <div className="flex space-x-4 mb-4">
        <button
          className={`px-4 py-2 rounded-md ${
            activeTab === "pending" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => changeTab("pending")}
        >
          Tickets Pendientes
        </button>
        <button
          className={`px-4 py-2 rounded-md ${
            activeTab === "processed" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => changeTab("processed")}
        >
          Tickets Finalizados
        </button>
      </div>

      {/* Tabla de tickets */}
      <div className="overflow-x-auto">
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
                    className={`border-b border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer ${
                      expandedTicket === ticket.id ? "bg-gray-100" : ""
                    }`}
                  >
                    <td className="py-2 px-4">{ticket.id}</td>
                    <td className="py-2 px-4">{ticket.email}</td>
                    <td className="py-2 px-4">
                      <div className="flex items-center space-x-2">
                        <MoneyIcon
                          className={`w-5 h-5 ${
                            ticket.paymentStatus === "pending" ? "text-green-500" : "text-red-500"
                          }`}
                        />
                        <span>{ticket.paymentStatus ? "Pagado" : "No Pagado"}</span>
                      </div>
                    </td>
                    <td className="py-2 px-4">
                      {ticket.date ? new Date(ticket.date.seconds * 1000).toLocaleString() : "Fecha no disponible"}
                    </td>
                    <td className="py-2 px-4 flex justify-center space-x-2">
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
                    </td>
                  </tr>

                  {/* Información adicional del ticket */}
                  {expandedTicket === ticket.id && (
                    <tr>
                      <td colSpan="5" className="py-4 px-4 bg-gray-50">
                        {/* Aquí puedes mostrar más información del ticket */}
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
                                <th className="py-2 px-4 text-left">Total</th>
                              </tr>
                            </thead>
                            <tbody>
                              {ticket.products.map((product, index) => (
                                <tr key={index}>
                                  <td className="py-2 px-4">{product.sku}</td>
                                  <td className="py-2 px-4">{product.quantity}</td>
                                  <td className="py-2 px-4">${product.price}</td>
                                  <td className="py-2 px-4">
                                    ${product.quantity * product.price}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>

                          {/* Total de la factura */}
                          <div className="flex justify-end mt-4 font-bold text-xl">
                            Total: ${getTotalAmount(ticket)}
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

      {/* Paginación */}
      <div className="flex justify-between mt-4">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-md"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
        >
          Anterior
        </button>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-md"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default TicketTable;

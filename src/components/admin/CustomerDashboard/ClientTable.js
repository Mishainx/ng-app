import TrashIcon from "@/icons/TrashIcon";
import EditIcon from "@/icons/EditIcon";
import { useClients } from "@/context/ClientsContext";
import { useState } from "react";
import WhatsappIcon from "@/icons/WhatsappIcon";
import { formatWhatsAppNumber } from "@/utils/stringsManager";
import { capitalizeFirstLetter } from "@/utils/stringsManager";
import { toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

const ClientTable = ({ handleViewChange, searchTerm }) => {
  const { clients, deleteClient } = useClients();
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedClient, setExpandedClient] = useState(null);

  const filteredClients = searchTerm.length >= 3 
    ? clients.filter(client =>
        Object.values(client).some(value =>
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    : clients;

  const totalPages = Math.ceil(filteredClients.length / itemsPerPage);
  const paginatedClients = filteredClients.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const toggleExpandClient = (cuit) => {
    setExpandedClient(prev => (prev === cuit ? null : cuit));
  };

  const handleDeleteClient = async (clientId) => {
    if (confirm("¿Estás seguro de que quieres eliminar este cliente?")) {
      try {
        await deleteClient(clientId);
        toast.success("Cliente eliminado con éxito.");
      } catch (error) {
        console.error("Error al eliminar el cliente:", error);
        toast.error("Error al eliminar el cliente. Intenta nuevamente.");
      }
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-300 text-sm rounded-md shadow-lg">
        <thead>
          <tr className="bg-gray-100 border-b border-gray-300">
            <th className="py-3 px-4 text-left">Nombre</th>
            <th className="py-3 px-4 text-left hidden xs:table-cell">Apellido</th>
            <th className="py-3 px-4 text-left">Email</th>
            <th className="py-3 px-4 text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {paginatedClients.length > 0 ? (
            paginatedClients.map((client) => (
              <>
                <tr
                  key={client.cuit}
                  onClick={() => toggleExpandClient(client.cuit)}
                  className={`border-b border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer ${
                    expandedClient === client.cuit ? "bg-gray-100" : ""
                  }`}
                >
                  <td className="py-2 px-4">{capitalizeFirstLetter(client.name)}</td>
                  <td className="py-2 px-4 hidden xs:table-cell">{capitalizeFirstLetter(client.surname)}</td>
                  <td className="py-2 px-4">{client.email}</td>
                  <td className="py-2 px-4 flex justify-center space-x-2">
                    <a
                      href={`https://wa.me/${formatWhatsAppNumber(client.whatsapp)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-green-500 hover:text-green-700 transition"
                    >
                      <WhatsappIcon className="w-5 h-5" />
                    </a>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleViewChange("edit", client); }}
                      className="text-yellow-500 hover:text-yellow-700 transition"
                    >
                      <EditIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDeleteClient(client.id); }}
                      className="text-red-500 hover:text-red-700 transition"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
                {expandedClient === client.cuit && (
                  <tr>
                    <td colSpan="4" className="bg-gray-50 p-4 text-gray-700">
                      <div className="space-y-2">
                        <p>
                          <span className="font-semibold">Dirección:</span> {client.address}, {client.city}, {client.province}, {client.country}
                        </p>
                        <p><span className="font-semibold">CUIT:</span> {client.cuit}</p>
                        <p><span className="font-semibold">Razón Social:</span> {client.businessName}</p>
                        <p><span className="font-semibold">WhatsApp:</span> {formatWhatsAppNumber(client.whatsapp)}</p>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="py-2 text-center text-gray-500">No hay clientes disponibles.</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Paginación */}
      <div className="mt-4 flex justify-between items-center">
        <p className="text-sm text-gray-700">
          Página {currentPage} de {totalPages || 1}
        </p>
        <div className="flex space-x-2">
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
    </div>
  );
};

export default ClientTable;

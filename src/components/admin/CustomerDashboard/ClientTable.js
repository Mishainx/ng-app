import TrashIcon from "@/icons/TrashIcon";
import EditIcon from "@/icons/EditIcon";
import { useClients } from "@/context/ClientsContext";
import { useState } from "react";
import WhatsappIcon from "@/icons/WhatsappIcon";
import { formatWhatsAppNumber } from "@/utils/stringsManager";
import { capitalizeFirstLetter } from "@/utils/stringsManager";
import MailIcon from "@/icons/MailIcon";
import { toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import * as XLSX from "xlsx";  // Importamos la librería para generar el archivo Excel

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

  const handleExportToExcel = () => {
    // Eliminar los campos no deseados y reordenar los campos en el formato especificado
    const cleanedClients = filteredClients.map((client) => {
      return {
        id: client.id,
        email: client.email,
        businessName: client.businessName,
        name: client.name,
        surname: client.surname,
        whatsapp: formatWhatsAppNumber(client.whatsapp),
        country: client.country,
        province: client.province,
        city: client.city,
        address: client.address
      };
    });
  
    // Crear una hoja de Excel con los datos ordenados
    const ws = XLSX.utils.json_to_sheet(cleanedClients);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Clientes");
    XLSX.writeFile(wb, "clientes.xlsx");
  };
  return (
    <div className="overflow-x-auto">
            {/* Exportar a Excel */}
            <div className="flex justify-end m-4 text-xs">
        <button
          onClick={handleExportToExcel}
          className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
        >
          Exportar a Excel
        </button>
      </div>
      
      <table className="min-w-full bg-white border border-gray-300 text-sm rounded-md shadow-lg">
        <thead>
          <tr className="bg-gray-100 border-b border-gray-300">
            <th className="py-2 px-3 text-left">Nombre</th>
            <th className="py-2 px-3 text-left hidden xs:table-cell">Apellido</th>
            <th className="py-2 px-3 text-left">Email</th>
            <th className="py-2 px-3 text-center">Acciones</th>
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
                  <td className="py-1 px-3">{capitalizeFirstLetter(client.name)}</td>
                  <td className="py-1 px-3 hidden xs:table-cell">{capitalizeFirstLetter(client.surname)}</td>
                  <td className="py-1 px-3">{client.email}</td>
                  <td className="py-1 px-3 flex justify-center space-x-1">
                    <a
                      href={`https://wa.me/${formatWhatsAppNumber(client.whatsapp)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-green-500 hover:text-green-700 transition"
                    >
                      <WhatsappIcon className="w-4 h-4" />
                    </a>
                    <a
                      href={`mailto:${client.email}`}
                      onClick={(e) => e.stopPropagation()}
                      className="text-blue-500 hover:text-blue-700 transition"
                    >
                      <MailIcon className="w-4 h-4" />
                    </a>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleViewChange("edit", client); }}
                      className="text-yellow-500 hover:text-yellow-700 transition"
                    >
                      <EditIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDeleteClient(client.id); }}
                      className="text-red-500 hover:text-red-700 transition"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
                {expandedClient === client.cuit && (
                  <tr>
                    <td colSpan="4" className="bg-gray-50 p-3 text-gray-700">
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
      {filteredClients.length > itemsPerPage && (
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

export default ClientTable;

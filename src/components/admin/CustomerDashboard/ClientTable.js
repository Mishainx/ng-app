import React, { useState } from "react";
import TrashIcon from "@/icons/TrashIcon";
import EditIcon from "@/icons/EditIcon";
import { useClients } from "@/context/ClientsContext";
import WhatsappIcon from "@/icons/WhatsappIcon";
import { formatWhatsAppNumber, capitalizeFirstLetter } from "@/utils/stringsManager";
import MailIcon from "@/icons/MailIcon";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as XLSX from "xlsx";

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

  const toggleExpandClient = (id) => {
    setExpandedClient(prev => (prev === id ? null : id));
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
    const cleanedClients = filteredClients.map(client => ({
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
    }));

    const ws = XLSX.utils.json_to_sheet(cleanedClients);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Clientes");
    XLSX.writeFile(wb, "clientes.xlsx");
  };

  return (
    <div className="overflow-x-auto">
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
            paginatedClients.map(client => (
              <React.Fragment key={client.id}>
                <tr
                  onClick={() => toggleExpandClient(client.id)}
                  className={`border-b border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer ${
                    expandedClient === client.id ? "bg-gray-100" : ""
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
                      onClick={e => e.stopPropagation()}
                      className="text-green-500 hover:text-green-700 transition"
                    >
                      <WhatsappIcon className="w-4 h-4" />
                    </a>
                    <a
                      href={`mailto:${client.email}`}
                      onClick={e => e.stopPropagation()}
                      className="text-blue-500 hover:text-blue-700 transition"
                    >
                      <MailIcon className="w-4 h-4" />
                    </a>
                    <button
                      onClick={e => { e.stopPropagation(); handleViewChange("edit", client); }}
                      className="text-yellow-500 hover:text-yellow-700 transition"
                    >
                      <EditIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={e => { e.stopPropagation(); handleDeleteClient(client.id); }}
                      className="text-red-500 hover:text-red-700 transition"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
                {expandedClient === client.id && (
                  <tr key={`expanded-${client.id}`}>
                    <td colSpan="4" className="bg-gray-50 p-3 text-gray-700">
                      <div className="space-y-2">
                        <p><span className="font-semibold">Dirección:</span> {client.address}, {client.city}, {client.province}, {client.country}</p>
                        <p><span className="font-semibold">CUIT:</span> {client.cuit}</p>
                        <p><span className="font-semibold">Razón Social:</span> {client.businessName}</p>
                        <p><span className="font-semibold">WhatsApp:</span> {formatWhatsAppNumber(client.whatsapp)}</p>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="py-2 text-center text-gray-500">No hay clientes disponibles.</td>
            </tr>
          )}
        </tbody>
      </table>

{/* Controles de paginación y selector responsivo */}
<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-4 py-4 gap-3 text-sm">
  {/* Selector de cantidad */}
  <div className="flex flex-wrap items-center gap-2">
    <label htmlFor="itemsPerPage" className="text-gray-700">Mostrar:</label>
    <select
      id="itemsPerPage"
      value={itemsPerPage}
      onChange={(e) => {
        setItemsPerPage(Number(e.target.value));
        setCurrentPage(1); // Reinicia la página
      }}
      className="border border-gray-300 rounded px-2 py-1"
    >
      <option value={5}>5</option>
      <option value={10}>10</option>
      <option value={20}>20</option>
      <option value={50}>50</option>
    </select>
    <span>clientes por página</span>
  </div>

  {/* Paginación */}
  <div className="flex flex-wrap items-center gap-1 justify-center sm:justify-end">
    <button
      onClick={() => {
        setCurrentPage(prev => Math.max(prev - 1, 1));
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }}
      disabled={currentPage === 1}
      className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300"
    >
      Anterior
    </button>

    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
      <button
        key={page}
        onClick={() => {
          setCurrentPage(page);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        className={`px-3 py-1 rounded ${
          page === currentPage
            ? "bg-red-500 text-white"
            : "bg-gray-100 hover:bg-gray-200"
        }`}
      >
        {page}
      </button>
    ))}

    <button
      onClick={() => {
        setCurrentPage(prev => Math.min(prev + 1, totalPages));
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }}
      disabled={currentPage === totalPages}
      className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300"
    >
      Siguiente
    </button>
  </div>
</div>


    </div>
  );
};

export default ClientTable;
"use client";

import { useState } from "react";
import TicketTable from "./TicketsTable";
import { useTickets } from "@/context/TicketsContext";

const TicketDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { tickets, loading, error } = useTickets(); // Obtener tickets del contexto

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value); // Permite que el valor se actualice siempre
  };

  if (loading) return <div>Cargando tickets...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Panel de Administración de Tickets</h1>

      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Buscar Tickets:</label>
        <input
          type="text"
          placeholder="Buscar ticket"
          value={searchTerm}
          onChange={handleSearchChange}
          className="border rounded w-full py-2 px-3"
        />
      </div>

      <TicketTable
        tickets={tickets}
        searchTerm={searchTerm}
      />
    </div>
  );
};

export default TicketDashboard;

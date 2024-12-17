"use client"

import { useState, useEffect } from "react";
import ClientTable from "./ClientTable";
import ClientForm from "./ClientForm";
import { useClients } from "@/context/ClientsContext";


const CustomerDashboard = ({resetView}) => {
  const [view, setView] = useState("list");
  const [editingClient, setEditingClient] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { clients, loading, error } = useClients(); // Obtener clientes del contexto

  useEffect(() => {
    setView("list");
  }, [resetView]);

  const handleViewChange = (newView, client = null) => {
    setEditingClient(client);
    setView(newView);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value); // Permite que el valor se actualice siempre
  };
  

  if (loading) return <div>Cargando clientes...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-1xl font-bold mb-2">Panel de Administración de Clientes</h1>

      {view === "list" ? (
        <>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Buscar Clientes:</label>
            <input
              type="text"
              placeholder="Buscar cliente"
              value={searchTerm}
              onChange={handleSearchChange}
              className="border rounded w-full py-2 px-3"
            />
          </div>

          <ClientTable
            clients={clients}
            handleViewChange={handleViewChange}
            searchTerm={searchTerm}
          />
        </>
      ) : (
        <ClientForm
          editingClient={editingClient}
          setView={setView}
        />
      )}
    </div>
  );
};

export default CustomerDashboard;

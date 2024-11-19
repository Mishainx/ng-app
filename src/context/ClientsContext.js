"use client";

import { createContext, useContext, useEffect, useState } from "react";

// Crear contexto
const ClientsContext = createContext();

// Proveedor del contexto
export const ClientsProvider = ({ children }) => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedClient, setSelectedClient] = useState(null);


  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users`); // Cambia a tu endpoint
        if (!response.ok) throw new Error("Error al cargar los clientes");
        const data = await response.json();
        setClients(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);



const reloadClients = async () => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users`);
    if (!response.ok) throw new Error("Error al recargar los clientes");
    const data = await response.json();
    setClients(data);
  } catch (err) {
    setError(err.message);
    console.error(err.message);
  }
};


  // Función para eliminar un cliente
  const deleteClient = async (clientId) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${clientId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error("Error al eliminar el cliente");

      // Actualizar el estado eliminando el cliente eliminado
      setClients((prevClients) => prevClients.filter((client) => client.id !== clientId));
    } catch (err) {
      setError(err.message);
    }
  };

  // Función para actualizar un cliente
  const updateClient = async (clientId, updatedData) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${clientId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });
  
      if (!response.ok) throw new Error("Error al actualizar el cliente");
  
      const updatedClient = await response.json();
  
      await reloadClients();

    } catch (err) {
      setError(err.message);
    }
  };
  

  return (
    <ClientsContext.Provider value={{ clients, loading, error, deleteClient, updateClient }}>
      {children}
    </ClientsContext.Provider>
  );
};

// Hook para usar el contexto
export const useClients = () => {
  return useContext(ClientsContext);
};

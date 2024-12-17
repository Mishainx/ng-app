"use client";

import { createContext, useContext, useEffect, useState } from "react";

// Crear contexto
const TicketsContext = createContext();

// Proveedor del contexto
export const TicketsProvider = ({ children }) => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTicket, setSelectedTicket] = useState(null);

  // Función para obtener todos los tickets
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tickets`);
        if (!response.ok) throw new Error("Error al cargar los tickets");
        const data = await response.json();
        setTickets(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  const reloadTickets = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tickets`);
      if (!response.ok) throw new Error("Error al recargar los tickets");
      const data = await response.json();
      setTickets(data);
    } catch (err) {
      setError(err.message);
      console.error(err.message);
    }
  };

  // Función para eliminar un ticket
  const deleteTicket = async (ticketId) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tickets/${ticketId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error("Error al eliminar el ticket");

      setTickets((prevTickets) => prevTickets.filter((ticket) => ticket.id !== ticketId));
    } catch (err) {
      setError(err.message);
    }
  };

  // Función para actualizar un ticket
  const updateTicket = async (ticketId, updatedData) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tickets/${ticketId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) throw new Error("Error al actualizar el ticket");

      await reloadTickets();
    } catch (err) {
      setError(err.message);
    }
  };

  // Función para crear un ticket
  const createTicket = async (newTicketData) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tickets`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTicketData),
      });

      if (!response.ok) throw new Error("Error al crear el ticket");

      const createdTicket = await response.json();
      setTickets((prevTickets) => [...prevTickets, { id: createdTicket.id, ...createdTicket }]);
    } catch (err) {
      setError(err.message);
    }
  };

  // Función para archivar o desarchivar un ticket
  const archiveTicket = async (ticketId) => {
    try {
      const ticket = tickets.find((t) => t.id === ticketId); // Encuentra el ticket actual
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tickets/${ticketId}/archive`, {
        method: 'PATCH', // Usamos el mismo método PATCH para ambos casos
      });

      if (!response.ok) throw new Error("Error al archivar o desarchivar el ticket");

      // Actualizar el estado para reflejar que el ticket está archivado o desarchivado
      setTickets((prevTickets) =>
        prevTickets.map((ticket) =>
          ticket.id === ticketId
            ? { ...ticket, processed: !ticket.processed } // Cambiar el estado de 'processed' (archivado/desarchivado)
            : ticket
        )
      );
    } catch (err) {
      setError(err.message);
    }
  };

  // Función para actualizar el estado de pago de un ticket
  const updatePaymentStatus = async (ticketId, newStatus) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tickets/${ticketId}/payment`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ paymentStatus: newStatus }),
      });

      if (!response.ok) throw new Error("Error al actualizar el estado de pago");

      // Actualizar el estado de pago localmente
      setTickets((prevTickets) =>
        prevTickets.map((ticket) =>
          ticket.id === ticketId
            ? { ...ticket, paymentStatus: newStatus } // Actualizamos el estado de pago
            : ticket
        )
      );
    } catch (err) {
      setError(err.message);
    }
  };

  const getUserTickets = async (userEmail) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tickets/users/${userEmail}`);
      if (!response.ok) throw new Error("Error al cargar los tickets del usuario");
      const data = await response.json();
      setTickets(data); // Actualiza los tickets en el estado
    } catch (err) {
      setError(err.message);
    }
  };

  // Función para manejar la acción de archivar o desarchivar
  const handleArchiveTicket = async (ticketId, e) => {
    e.stopPropagation(); // Evitar que se propague el evento

    const ticket = tickets.find((t) => t.id === ticketId); // Encuentra el ticket actual

    const action = ticket.processed ? "desarchivar" : "archivar"; // Determina si estamos archivando o desarchivando
    const actionMessage = action === "archivar" ? "archivado" : "desarchivado"; // Mensaje que se mostrará en el toast

    if (confirm(`¿Estás seguro de que quieres ${action} este ticket?`)) {
      try {
        await archiveTicket(ticketId); // Llamar a la función para archivar o desarchivar
        toast.success(`Ticket ${actionMessage} con éxito.`); // Mensaje de éxito dinámico
      } catch (error) {
        console.error("Error al archivar o desarchivar el ticket:", error);
        toast.error(`Error al ${action} el ticket. Intenta nuevamente.`); // Mensaje de error dinámico
      }
    }
  };

  return (
    <TicketsContext.Provider value={{
      tickets, loading, error, deleteTicket, updateTicket, createTicket, reloadTickets, archiveTicket, updatePaymentStatus, getUserTickets
    }}>
      {children}
    </TicketsContext.Provider>
  );
};

// Hook para usar el contexto
export const useTickets = () => {
  return useContext(TicketsContext);
};

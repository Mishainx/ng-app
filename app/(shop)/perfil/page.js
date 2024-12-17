"use client";

import { useAuth } from "@/context/AuthContext";
import EditIcon from "@/icons/EditIcon";
import { useEffect, useState } from "react";
import React from "react";

export default function Perfil() {
  const { userData, loading: authLoading, error: authError } = useAuth();
  const [tickets, setTickets] = useState([]); // Estado para almacenar los tickets
  const [expandedTicket, setExpandedTicket] = useState(null); // Estado para gestionar la expansión de los tickets
  const [ticketsLoading, setTicketsLoading] = useState(true); // Estado de carga de tickets
  const [ticketsError, setTicketsError] = useState(null); // Estado de error de tickets

  // Obtener los tickets del usuario cuando se cargue la página
  useEffect(() => {
    const fetchUserTickets = async () => {
      // Asegurarse de que el usuario esté autenticado antes de hacer el fetch
      if (userData?.email) {
        try {
          setTicketsLoading(true); // Iniciamos la carga
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tickets/users/${userData.email}`);
          if (!response.ok) {
            throw new Error("No se pudieron obtener los tickets");
          }
          const data = await response.json();
          setTickets(data); // Establecemos los tickets obtenidos
        } catch (error) {
          setTicketsError(error.message); // Establecemos el error
        } finally {
          setTicketsLoading(false); // Finalizamos la carga
        }
      }
    };

    if (userData?.email) {
      fetchUserTickets(); // Solo ejecutamos si userData tiene un email
    }
  }, [userData?.email]); // Se asegura de que solo se ejecute cuando el email cambie

  if (authLoading || ticketsLoading) return <p>Cargando...</p>;
  if (authError) return <p>Error: {authError}</p>;
  if (ticketsError) return <p>Error al cargar los tickets: {ticketsError}</p>;

  if (!userData) {
    return <p>No hay información del usuario disponible.</p>;
  }

  const { name, surname, email, city, address, province, country, businessName, cuit } = userData;

  // Función para alternar la expansión de productos
  const toggleProducts = (ticketId) => {
    setExpandedTicket((prevTicket) => (prevTicket === ticketId ? null : ticketId)); // Alterna entre expandir y contraer
  };

  return (
    <main className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      {/* Header */}
      <section className="w-full max-w-3xl bg-white shadow-md rounded-lg p-6 mb-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Perfil de Usuario</h1>
          <button className="text-gray-600 hover:text-gray-800">
            <EditIcon />
          </button>
        </div>
        <p className="text-sm text-gray-500">Bienvenido, {name}.</p>
      </section>

      {/* Información del usuario */}
      <section className="w-full max-w-3xl bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Información Personal</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-600">Nombre:</p>
            <p className="text-lg">{name} {surname}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Email:</p>
            <p className="text-lg">{email}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Ciudad:</p>
            <p className="text-lg">{city}, {province}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Dirección:</p>
            <p className="text-lg">{address}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">País:</p>
            <p className="text-lg">{country}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">CUIT:</p>
            <p className="text-lg">{cuit}</p>
          </div>
        </div>
      </section>

      {/* Información adicional */}
      <section className="w-full max-w-3xl bg-white shadow-md rounded-lg p-6 mt-6">
        <h2 className="text-xl font-semibold mb-4">Información Comercial</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-600">Nombre Comercial:</p>
            <p className="text-lg">{businessName}</p>
          </div>
        </div>
      </section>

      {/* Tickets del usuario */}
      <section className="w-full max-w-3xl bg-white shadow-md rounded-lg p-6 mt-6">
        <h2 className="text-xl font-semibold mb-4">Mis Tickets</h2>
        {tickets.length === 0 ? (
          <p className="text-gray-500">No tienes tickets disponibles.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Ticket ID</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Monto Total</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Estado de Pago</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Fecha</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Productos</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {tickets.map((ticket) => (
                  <React.Fragment key={ticket.id}>
                    <tr>
                      <td className="px-6 py-4 text-sm font-medium text-gray-800">{ticket.id}</td>
                      <td className="px-6 py-4 text-sm text-gray-800">${ticket.totalAmount}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{ticket.paymentStatus ? "Pagado" : "Pendiente"}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(ticket.date.seconds * 1000).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        <button
                          className="bg-red-500 text-white font-medium px-4 py-2 rounded-md hover:bg-red-600 transition-all"
                          onClick={() => toggleProducts(ticket.id)} 
                        >
                          {expandedTicket === ticket.id ? "-" : "+"}
                        </button>
                      </td>
                    </tr>

                    {/* Filas para mostrar los productos debajo del ticket expandido */}
                    {expandedTicket === ticket.id && (
                      <tr>
                        <td colSpan="5" className="px-6 py-4">
                          <table className="min-w-full table-auto divide-y divide-gray-200">
                            <thead className="bg-gray-100">
                              <tr>
                                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">SKU</th>
                                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Cantidad</th>
                                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Precio</th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {ticket.products.map((product, index) => (
                                <tr key={index}>
                                  <td className="px-6 py-4 text-sm text-gray-800">{product.sku}</td>
                                  <td className="px-6 py-4 text-sm text-gray-800">{product.quantity}</td>
                                  <td className="px-6 py-4 text-sm text-gray-800">${product.price}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Botones */}
      <section className="w-full max-w-3xl flex justify-end mt-6">
        <button className="bg-blue-500 text-white font-medium px-6 py-2 rounded-lg shadow hover:bg-blue-600">
          Editar Perfil
        </button>
      </section>
    </main>
  );
}

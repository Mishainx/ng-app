"use client";

import { useState, useEffect } from "react";
import Loader from "@/components/loader/Loader";
import { useAuth } from "@/context/AuthContext";
import Tabs from "@/components/profile/Tabs";
import UserTab from "@/components/profile/UserTab";
import OrdersTab from "@/components/profile/OrderTab";

export default function PerfilPage() {
  const { loading } = useAuth();
  const [userData, setUserData] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [ticketsLoading, setTicketsLoading] = useState(true);
  const [ticketsError, setTicketsError] = useState(null);
  const [userDataLoading, setUserDataLoading] = useState(true);
  const [userDataError, setUserDataError] = useState(null);

  const [activeTab, setActiveTab] = useState("usuario");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setUserDataLoading(true);
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/profile`);
        if (!response.ok) throw new Error("Error al obtener los datos del usuario");
        const data = await response.json();
        setUserData(data);
      } catch (error) {
        setUserDataError(error.message);
      } finally {
        setUserDataLoading(false);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    if (userData?.email) {
      const fetchUserTickets = async () => {
        try {
          setTicketsLoading(true);
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tickets/users/${userData.email}`);
          if (!response.ok) throw new Error("Error al obtener los tickets");
          const data = await response.json();
          setTickets(data);
        } catch (error) {
          setTicketsError(error.message);
        } finally {
          setTicketsLoading(false);
        }
      };

      fetchUserTickets();
    }
  }, [userData?.email]);

  if (loading || userDataLoading || ticketsLoading) return <Loader />;
  if (userDataError) return <p>Error: {userDataError}</p>;
  if (ticketsError) return <p>Error: {ticketsError}</p>;

  return (
    <main className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
      {activeTab === "usuario" && <UserTab userData={userData} />}
      {activeTab === "pedidos" && <OrdersTab tickets={tickets} />}
    </main>
  );
}

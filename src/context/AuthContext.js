"use client";
// context/AuthContext.js
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to handle user login (fetching full user profile during login)
  const login = async (credentials) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });
  
      if (!response.ok) {
        // Lanza un error con el mensaje que viene del backend (si es posible) o usa un mensaje genérico
        const errorMessage = await response.text();
        throw new Error(errorMessage || "Error en el inicio de sesión");
      }
  
      const data = await response.json();
      setUserData(data); // Almacena los datos del usuario
      setLoading(false); // Detiene el estado de carga
      return data; // Retorna los datos para que los componentes que llaman puedan usarlos si es necesario
    } catch (error) {
      setError(error.message);
      setLoading(false);
      throw error; // Propaga el error hacia los componentes que llamen a esta función
    }
  };
  

  // Optional: This useEffect can be removed if you handle the data entirely in login
  useEffect(() => {
    // Only fetch profile if no userData exists (e.g., user refreshes the page)
    const fetchUserProfile = async () => {
      if (!userData) {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/profile`);
          if (!response.ok) {
            throw new Error("Error al obtener los datos del perfil");
          }
          const data = await response.json();
          setUserData(data); // Set profile data
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUserProfile();
  }, [userData]); // This effect runs only if userData is null

  return (
    <AuthContext.Provider value={{ userData, loading, error, login }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

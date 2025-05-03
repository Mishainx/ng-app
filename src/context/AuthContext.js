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

    // Function to handle QR code login (anonymous login via backend)
    const qrLogin = async (qrCode) => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/login/qr`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ qrCode }),
        });
  
        if (!response.ok) {
          const errorMessage = await response.json(); // Espera un JSON con el error
          throw new Error(errorMessage?.error || "Error al iniciar sesión con código QR");
        }
  
        const data = await response.json();
        const customToken = data.user;
        setUserData(customToken); // Almacena los datos del usuario

        setLoading(false);
        return data; // Opcional: puedes retornar información adicional si es necesario
      } catch (error) {
        setError(error.message);
        setLoading(false);
        throw error;
      }
    };

  // Function to handle password reset
  const resetPassword = async (email) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage || "Error al enviar el enlace de restablecimiento");
      }

      return await response.json(); // Retorna los datos de la respuesta del backend si es exitoso
    } catch (error) {
      setError(error.message);
      throw error; // Propaga el error hacia los componentes que llamen a esta función
    }
  };

  // Optional: Fetch profile when the component mounts
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/profile`);
        if (!response.ok) {
          throw new Error("Error al obtener los datos del perfil");
        }
        const data = await response.json();
        setUserData(data); // Set profile data
      } catch (err) {
        setError(err.message);
        setUserData(null); // Clear user data if there's an error
      } finally {
        setLoading(false);
      }
    };

    if (!userData) {
      fetchUserProfile();
    }
  }, []); // Runs once when the component mounts

  // Effect to react to userData changes
  useEffect(() => {
    if (userData) {

    }
  }, [userData]); // Monitorea los cambios en userData

  return (
    <AuthContext.Provider value={{ userData, loading, error, login, resetPassword,qrLogin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

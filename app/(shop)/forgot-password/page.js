"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext"; // Importar el contexto de autenticación

const ForgotPasswordForm = () => {
  const router = useRouter();
  const { resetPassword } = useAuth(); // Suponiendo que tienes una función de restablecimiento de contraseña
  const [email, setEmail] = useState(""); // Solo necesitamos el correo electrónico
  const [error, setError] = useState(""); // Estado para el mensaje de error
  const [success, setSuccess] = useState(""); // Estado para el mensaje de éxito

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await resetPassword(email); // Llama a la función de restablecimiento de contraseña
      if (response) {
        setSuccess("Te hemos enviado un enlace para restablecer tu contraseña.");
        setError(""); // Limpiar el error en caso de éxito
      }
    } catch (err) {
      setError("Error al enviar el enlace. Por favor, verifica tu correo.");
      setSuccess(""); // Limpiar el mensaje de éxito en caso de error
    }
  };

  return (
    <div className="flex justify-center items-center w-full h-screen bg-gray-900">
      <form
        onSubmit={handleSubmit}
        className="p-6 sm:px-8 rounded-xl w-full max-w-md mx-2 sm:mx-0 bg-gray-800 shadow-lg"
      >
        <h2 className="text-2xl font-bold text-center text-white mb-6">
          ¿Olvidaste tu contraseña?
        </h2>
        
        {/* Mostrar el mensaje de éxito si existe */}
        {success && <p className="text-green-500 text-center mb-4">{success}</p>}
        
        {/* Mostrar el mensaje de error si existe */}
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        
        <input
          type="email"
          value={email}
          required
          placeholder="Tu email"
          className="p-3 rounded w-full border border-gray-700 bg-gray-700 text-white mb-4 focus:outline-none focus:border-red-500"
          name="email"
          onChange={handleChange}
        />
        
        <div className="flex flex-col gap-4">
          <button
            type="submit"
            className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
          >
            Enviar enlace de restablecimiento
          </button>
          <Link href="/login" className="text-red-500 text-center hover:underline">
            Regresar al inicio de sesión
          </Link>
        </div>
      </form>
    </div>
  );
};

export default ForgotPasswordForm;

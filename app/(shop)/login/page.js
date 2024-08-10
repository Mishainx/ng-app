"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from 'next/navigation';

const LoginForm = () => {
  const router = useRouter();
  const [values, setValues] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState(""); // Estado para el mensaje de error

  const handleChange = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });
  
      if (response.ok) {
        const success = await response.json();
        if (success) {
          router.push("/");
        } else {
          setError("Ocurrió un error. Por favor, intenta nuevamente."); // Mensaje mostrado en caso de error
        }
      } else {
        setError("Ocurrió un error. Por favor, intenta nuevamente."); // Mensaje mostrado en caso de fallo en el response
      }
    } catch (error) {
      setError("Ocurrió un error. Por favor, intenta nuevamente."); // Mensaje mostrado en caso de excepción
    }
  };
  
  return (
    <div className="flex justify-center items-center w-full h-screen bg-gray-900">
      <form
        onSubmit={handleSubmit}
        className="p-6 sm:px-8 rounded-xl w-full max-w-md mx-2 sm:mx-0 bg-gray-800 shadow-lg"
      >
        <h2 className="text-2xl font-bold text-center text-white mb-6">
          Inicia sesión o regístrate
        </h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <input
          type="email"
          value={values.email}
          required
          placeholder="Tu email"
          className="p-3 rounded w-full border border-gray-700 bg-gray-700 text-white mb-4 focus:outline-none focus:border-red-500"
          name="email"
          onChange={handleChange}
        />
        <input
          type="password"
          value={values.password}
          required
          placeholder="Tu contraseña"
          className="p-3 rounded w-full border border-gray-700 bg-gray-700 text-white mb-4 focus:outline-none focus:border-red-500"
          name="password"
          onChange={handleChange}
        />
        <div className="flex flex-col gap-4">
          <button
            type="submit"
            className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
          >
            Ingresar
          </button>
          <Link href="/signup" className="text-red-500 text-center hover:underline">
            Registrarse
          </Link>
          <Link href="/users/forgot-password" className="text-red-500 text-center hover:underline">
            ¿Olvidaste tu contraseña?
          </Link>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;

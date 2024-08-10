"use client";
import { useState } from "react";
import Link from "next/link";
import RegisterMessage from "./registerMessage";

const RegisterForm = () => {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [values, setValues] = useState({
    email: "",
    name: "",
    surname: "",
    whatsapp: "",
    address: "",
    city: "",
    province: "",
    country: "",
    password: "",
  });
  const [step, setStep] = useState(1);

  const handleChange = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (step < 3) {
        setStep(step + 1);
      } else {
              // Realizar el fetch POST a la API
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });
  
      // Verificar la respuesta de la API
      if (response.status === 201) {
        setSuccess(true);
      } else {
        const errorData = await response.json();
        setError(`Error al registrar el usuario: ${errorData.error}`);
      }
 
      }
    } catch (error) {
      setError("Error al registrar el usuario: " + error.message);
      throw error;
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {success ? (
        <RegisterMessage/>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="p-6 sm:px-8 rounded-xl bg-gray-800 shadow-lg"
        >
          <h2 className="text-2xl font-bold text-center text-white mb-6">
            {step === 1
              ? "Paso 1: Información personal"
              : step === 2
              ? "Paso 2: Dirección"
              : "Paso 3: Configura tu contraseña"}
          </h2>
          {error && (
            <div className="bg-red-500 text-white text-center p-2 mb-4 rounded">
              {error}
            </div>
          )}
          {step === 1 && (
            <>
              <input
                type="text"
                value={values.name}
                required
                placeholder="Name"
                className="p-2 rounded w-full border border-gray-700 bg-gray-700 text-white mb-3 focus:outline-none focus:border-red-500 text-sm"
                name="name"
                onChange={handleChange}
              />
              <input
                type="text"
                value={values.surname}
                required
                placeholder="Surname"
                className="p-2 rounded w-full border border-gray-700 bg-gray-700 text-white mb-3 focus:outline-none focus:border-red-500 text-sm"
                name="surname"
                onChange={handleChange}
              />
              <input
                type="email"
                value={values.email}
                required
                placeholder="Email"
                className="p-2 rounded w-full border border-gray-700 bg-gray-700 text-white mb-3 focus:outline-none focus:border-red-500 text-sm"
                name="email"
                onChange={handleChange}
              />
              <input
                type="text"
                value={values.whatsapp}
                required
                placeholder="WhatsApp"
                className="p-2 rounded w-full border border-gray-700 bg-gray-700 text-white mb-3 focus:outline-none focus:border-red-500 text-sm"
                name="whatsapp"
                onChange={handleChange}
              />
            </>
          )}
          {step === 2 && (
            <>
              <input
                type="text"
                value={values.address}
                required
                placeholder="Address"
                className="p-2 rounded w-full border border-gray-700 bg-gray-700 text-white mb-3 focus:outline-none focus:border-red-500 text-sm"
                name="address"
                onChange={handleChange}
              />
              <input
                type="text"
                value={values.city}
                required
                placeholder="City"
                className="p-2 rounded w-full border border-gray-700 bg-gray-700 text-white mb-3 focus:outline-none focus:border-red-500 text-sm"
                name="city"
                onChange={handleChange}
              />
              <input
                type="text"
                value={values.province}
                required
                placeholder="Province"
                className="p-2 rounded w-full border border-gray-700 bg-gray-700 text-white mb-3 focus:outline-none focus:border-red-500 text-sm"
                name="province"
                onChange={handleChange}
              />
              <input
                type="text"
                value={values.country}
                required
                placeholder="Country"
                className="p-2 rounded w-full border border-gray-700 bg-gray-700 text-white mb-3 focus:outline-none focus:border-red-500 text-sm"
                name="country"
                onChange={handleChange}
              />
            </>
          )}
          {step === 3 && (
            <>
              <input
                type="password"
                value={values.password}
                required
                placeholder="Password"
                className="p-2 rounded w-full border border-gray-700 bg-gray-700 text-white mb-3 focus:outline-none focus:border-red-500 text-sm"
                name="password"
                onChange={handleChange}
              />
              <input
                type="password"
                value={values.repeatPassword}
                required
                placeholder="Repeat Password"
                className="p-2 rounded w-full border border-gray-700 bg-gray-700 text-white mb-3 focus:outline-none focus:border-red-500 text-sm"
                name="repeatPassword"
                onChange={handleChange}
              />
            </>
          )}
          <div className="flex flex-col gap-4">
            <button
              type="submit"
              className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
            >
              {step < 3 ? "Siguiente" : "Registrarse"}
            </button>
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="text-red-500 mt-2 hover:underline text-sm"
              >
                Volver
              </button>
            )}
            <Link
              href="/login"
              className="text-red-500 text-center hover:underline mt-2 block text-sm"
            >
              ¿Ya tienes una cuenta? Inicia sesión
            </Link>
          </div>
        </form>
      )}
    </div>
  );
};

export default RegisterForm;

"use client"

import React, { useState } from "react";
import { toast } from "react-toastify";
import SpinnerIcon from "@/icons/SpinnerIcon";
import "react-toastify/dist/ReactToastify.css";

const ArrepentimientoForm = () => {
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false); // Para manejar el estado de carga
  const [successMessage, setSuccessMessage] = useState(""); // Mensaje de éxito

  const validateForm = (event) => {
    const { name, email, orderNumber } = event.target.elements;
    const errors = {};

    if (name.value.length > 100) {
      errors.name = "El nombre o razón social no puede exceder los 100 caracteres.";
    }

    if (!email.value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      errors.email = "Debe ser un email válido.";
    }

    if (orderNumber.value.length < 20 || orderNumber.value.length > 40) {
      errors.orderNumber = "El ID de pedido debe tener entre 20 y 40 caracteres.";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validateForm(event)) {
      setLoading(true);
      const { name, email, orderNumber, orderDate, comment } = event.target.elements;

      const requestBody = {
        name: name.value,
        email: email.value,
        orderNumber: orderNumber.value,
        orderDate: orderDate.value,
        comment: comment.value,
      };

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/email/send-repentance`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        });

        if (response.ok) {
          setSuccessMessage("Formulario enviado correctamente.");
          toast.success("Formulario enviado correctamente.");
          event.target.reset(); // Resetear el formulario
        } else {
          throw new Error("Hubo un error al enviar el formulario.");
        }
      } catch (error) {
        setFormErrors({ general: error.message });
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <main className="w-full flex flex-col items-center justify-start">
      {/* Título de la página */}
      <div className="relative text-center mb-4">
        <h1 className="text-2xl font-semibold text-gray-800 inline-block relative">
          Formulario de Arrepentimiento
          <div className="absolute inset-x-0 -bottom-1 mx-auto w-full h-0.5 bg-red-400"></div>
        </h1>
      </div>

      {/* Mensaje de éxito o error */}
      {successMessage && <p className="text-green-500 text-sm mb-4">{successMessage}</p>}
      {formErrors.general && <p className="text-red-500 text-sm mb-4">{formErrors.general}</p>}

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="w-full max-w-md flex flex-col gap-3 bg-white p-4 shadow-sm rounded-md">
        <div className="flex flex-col">
          <label htmlFor="name" className="text-gray-600 font-medium mb-1 text-sm">
            Nombre y apellido / Razón social
          </label>
          <input
            type="text"
            id="name"
            name="name"
            maxLength="100"
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-400 text-sm"
            required
          />
          {formErrors.name && <small className="text-red-500 text-xs mt-1">{formErrors.name}</small>}
        </div>

        <div className="flex flex-col">
          <label htmlFor="email" className="text-gray-600 font-medium mb-1 text-sm">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-400 text-sm"
            required
          />
          {formErrors.email && <small className="text-red-500 text-xs mt-1">{formErrors.email}</small>}
        </div>

        <div className="flex flex-col">
          <label htmlFor="orderNumber" className="text-gray-600 font-medium mb-1 text-sm">
            N° de pedido
          </label>
          <input
            type="text"
            id="orderNumber"
            name="orderNumber"
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-400 text-sm"
            required
            placeholder="Ej: 04DAn2a8hV7MnDlKvYUq"
          />
          {formErrors.orderNumber && <small className="text-red-500 text-xs mt-1">{formErrors.orderNumber}</small>}
        </div>

        <div className="flex flex-col">
          <label htmlFor="orderDate" className="text-gray-600 font-medium mb-1 text-sm">
            Fecha de pedido
          </label>
          <input
            type="date"
            id="orderDate"
            name="orderDate"
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-400 text-sm"
            required
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="comment" className="text-gray-600 font-medium mb-1 text-sm">
            Comentario
          </label>
          <textarea
            id="comment"
            name="comment"
            rows="3"
            maxLength="200"
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-400 text-sm"
          ></textarea>
          <small className="text-gray-500 text-xs mt-1">Máximo 200 caracteres.</small>
        </div>

        <button
  type="submit"
  className="bg-red-400 text-white font-medium py-2 px-3 rounded-md hover:bg-red-500 transition-colors duration-200 text-sm flex items-center justify-center"
  disabled={loading}
>
  {loading ? (
    <>
      <SpinnerIcon className="w-5 h-5 animate-spin mr-2" /> Enviando...
    </>
  ) : (
    "Enviar"
  )}
</button>

      </form>

      {/* Leyenda */}
      <p className="text-gray-500 text-xs mt-4 text-center w-10/12">
        NipponGame - Av.Corrientes 2416, C1046AAP, Ciudad de Buenos Aires, Argentina
        <br />
        El derecho de arrepentimiento podrá ejercerse dentro de los 10 días desde la celebración del contrato o la entrega
        del bien lo que ocurra después, en los términos de los artículos 1110 del CCyCN y 34 de la LDC, con las excepciones
        del artículo 1116 del CCyCN.
      </p>
    </main>
  );
};

export default ArrepentimientoForm;

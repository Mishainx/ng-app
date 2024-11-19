import { useState, useEffect } from "react";
import { useClients } from "@/context/ClientsContext";

const ClientForm = ({ editingClient, setView }) => {
  const { updateClient } = useClients();

  const [businessName, setBusinessName] = useState("");
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [province, setProvince] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [cuit, setCuit] = useState("");

  // Cargar los datos del cliente en edición
  useEffect(() => {
    if (editingClient) {
      setBusinessName(editingClient.businessName || "");
      setName(editingClient.name || "");
      setSurname(editingClient.surname || "");
      setCity(editingClient.city || "");
      setAddress(editingClient.address || "");
      setProvince(editingClient.province || "");
      setWhatsapp(editingClient.whatsapp || "");
      setEmail(editingClient.email || "");
      setCuit(editingClient.cuit || "");
    }
  }, [editingClient]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const clientData = {
      businessName,
      name,
      surname,
      city,
      address,
      province,
      whatsapp,
      email,
      cuit,
    };

    if (editingClient) {
      await updateClient(editingClient.id, clientData); // Llama a la función de contexto
    }

    setView("list"); // Cambia la vista a la lista de clientes
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-8 mt-10">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-900">
        {editingClient ? "Actualizar Cliente" : "Crear Cliente"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Email (deshabilitado) */}
        <div>
          <label className="block text-gray-800 mb-1">Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)} // Si quieres que no sea actualizable, puedes eliminar esta línea
            className="border rounded-md w-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100 text-gray-800 placeholder-gray-500"
            placeholder="Ej: cliente@ejemplo.com"
            disabled // Deshabilita el campo para que no sea editable
            required
          />
        </div>
        {/* Razón social */}
        <div>
          <label className="block text-gray-800 mb-1">Razón Social:</label>
          <input
            type="text"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            className="border rounded-md w-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100 text-gray-800 placeholder-gray-500"
            placeholder="Ej: Mi Empresa S.A."
            required
          />
        </div>
        {/* Nombre */}
        <div>
          <label className="block text-gray-800 mb-1">Nombre:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border rounded-md w-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100 text-gray-800 placeholder-gray-500"
            placeholder="Ej: Juan"
            required
          />
        </div>
        {/* Apellido */}
        <div>
          <label className="block text-gray-800 mb-1">Apellido:</label>
          <input
            type="text"
            value={surname}
            onChange={(e) => setSurname(e.target.value)}
            className="border rounded-md w-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100 text-gray-800 placeholder-gray-500"
            placeholder="Ej: Pérez"
            required
          />
        </div>
        {/* Ciudad */}
        <div>
          <label className="block text-gray-800 mb-1">Ciudad:</label>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="border rounded-md w-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100 text-gray-800 placeholder-gray-500"
            placeholder="Ej: Buenos Aires"
            required
          />
        </div>
        {/* Dirección */}
        <div>
          <label className="block text-gray-800 mb-1">Dirección:</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="border rounded-md w-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100 text-gray-800 placeholder-gray-500"
            placeholder="Ej: Calle Falsa 123"
            required
          />
        </div>
        {/* Provincia */}
        <div>
          <label className="block text-gray-800 mb-1">Provincia:</label>
          <input
            type="text"
            value={province}
            onChange={(e) => setProvince(e.target.value)}
            className="border rounded-md w-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100 text-gray-800 placeholder-gray-500"
            placeholder="Ej: Buenos Aires"
            required
          />
        </div>
        {/* WhatsApp */}
        <div>
          <label className="block text-gray-800 mb-1">WhatsApp:</label>
          <input
            type="text"
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            className="border rounded-md w-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100 text-gray-800 placeholder-gray-500"
            placeholder="Ej: +5491123456789"
            required
          />
        </div>
        {/* CUIT */}
        <div>
          <label className="block text-gray-800 mb-1">CUIT:</label>
          <input
            type="text"
            value={cuit}
            onChange={(e) => setCuit(e.target.value)}
            className="border rounded-md w-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100 text-gray-800 placeholder-gray-500"
            placeholder="Ej: 20-12345678-9"
            required
          />
        </div>
        {/* Botones */}
        <div className="flex justify-between mt-6">
          <button
            type="submit"
            className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition duration-200"
          >
            {editingClient ? "Actualizar Cliente" : "Crear Cliente"}
          </button>
          <button
            type="button"
            onClick={() => setView("list")}
            className="bg-gray-500 text-white px-5 py-2 rounded-md hover:bg-gray-600 transition duration-200"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default ClientForm;

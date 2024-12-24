import { useState } from "react";
import SpinnerIcon from "@/icons/SpinnerIcon";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";

export default function EditUserProfileForm({ userData, setIsEditing }) {
  const { name, surname, email, city, address, province, country, businessName, cuit } = userData;
  
  // Estados para manejar los datos editables y estado de carga
  const [businessNameValue, setBusinessName] = useState(businessName);
  const [nameValue, setName] = useState(name);
  const [surnameValue, setSurname] = useState(surname);
  const [cityValue, setCity] = useState(city);
  const [addressValue, setAddress] = useState(address);
  const [provinceValue, setProvince] = useState(province);
  const [countryValue, setCountry] = useState(country);
  const [cuitValue, setCuit] = useState(cuit);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Función para actualizar un cliente
  const updateClient = async (clientId, updatedData) => {
    try {
      setLoading(true); // Activamos el estado de carga

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${clientId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) throw new Error("Error al actualizar el cliente");

      const updatedClient = await response.json();

      // Notificación de éxito
      toast.success("Perfil actualizado correctamente");
      
      setTimeout(() => {
        window.location.reload(); // Refresca la página completamente
        window.scrollTo(0, 0); // Desplaza la página hacia arriba después del reload
        setIsEditing(false); // Cierra el formulario
      }, 2000);

    // Cierra el formulario después de 1 segundo (1000 ms)
    setTimeout(() => {
        setIsEditing(false);
      }, 2000); // Ajusta el tiempo según necesites
  

    } catch (err) {
      // Notificación de error
      toast.error(`Error: ${err.message}`);
    } finally {
      setLoading(false); // Desactivamos el estado de carga
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedData = {
      businessName: businessNameValue,
      name: nameValue,
      surname: surnameValue,
      city: cityValue,
      address: addressValue,
      province: provinceValue,
      country: countryValue,
      cuit: cuitValue,
    };
    await updateClient(userData.id, updatedData); // Llama la función para actualizar los datos
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl mx-auto bg-white p-4 rounded-lg shadow-md">
      <div>
        <label className="block text-xs text-gray-600 mb-1">Nombre:</label>
        <input
          type="text"
          value={nameValue}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border rounded-md text-sm bg-gray-100 text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          required
        />
      </div>

      <div>
        <label className="block text-xs text-gray-600 mb-1">Apellido:</label>
        <input
          type="text"
          value={surnameValue}
          onChange={(e) => setSurname(e.target.value)}
          className="w-full p-2 border rounded-md text-sm bg-gray-100 text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          required
        />
      </div>

      <div>
        <label className="block text-xs text-gray-600 mb-1">Razón Social:</label>
        <input
          type="text"
          value={businessNameValue}
          onChange={(e) => setBusinessName(e.target.value)}
          className="w-full p-2 border rounded-md text-sm bg-gray-100 text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          required
        />
      </div>

      <div>
        <label className="block text-xs text-gray-600 mb-1">Ciudad:</label>
        <input
          type="text"
          value={cityValue}
          onChange={(e) => setCity(e.target.value)}
          className="w-full p-2 border rounded-md text-sm bg-gray-100 text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          required
        />
      </div>

      <div>
        <label className="block text-xs text-gray-600 mb-1">Dirección:</label>
        <input
          type="text"
          value={addressValue}
          onChange={(e) => setAddress(e.target.value)}
          className="w-full p-2 border rounded-md text-sm bg-gray-100 text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          required
        />
      </div>

      <div>
        <label className="block text-xs text-gray-600 mb-1">Provincia:</label>
        <input
          type="text"
          value={provinceValue}
          onChange={(e) => setProvince(e.target.value)}
          className="w-full p-2 border rounded-md text-sm bg-gray-100 text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          required
        />
      </div>

      <div>
        <label className="block text-xs text-gray-600 mb-1">País:</label>
        <input
          type="text"
          value={countryValue}
          onChange={(e) => setCountry(e.target.value)}
          className="w-full p-2 border rounded-md text-sm bg-gray-100 text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          required
        />
      </div>

      <div>
        <label className="block text-xs text-gray-600 mb-1">CUIT:</label>
        <input
          type="text"
          value={cuitValue}
          onChange={(e) => setCuit(e.target.value)}
          className="w-full p-2 border rounded-md text-sm bg-gray-100 text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          required
        />
      </div>

      <div className="flex justify-between mt-4">
        <button
          type="submit"
          className="bg-red-500 text-white text-sm py-2 px-6 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          {loading ? (
            <div  className="flex">
              <SpinnerIcon className="animate-spin w-5 h-5" />
              <span className="ml-2">Actualizando...</span>
            </div>
          ) : (
            "Guardar Cambios"
          )}        </button>
        <button
          type="button"
          onClick={() => setIsEditing(false)}
          className="bg-gray-400 text-white text-sm py-2 px-6 rounded-md hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}

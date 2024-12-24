import { useState } from "react";
import EditUserProfileForm from "./EditUserProfileForm"; // Asumiendo que este es el archivo de tu formulario

export default function UserTab({ userData }) {
  const { name, surname, email, city, address, province, country, businessName, cuit } = userData;

  // Estado para gestionar si estamos editando o no
  const [isEditing, setIsEditing] = useState(false);

  return (
    <section className="w-full max-w-3xl bg-white shadow-sm rounded-xl p-6 space-y-6">
      <h2 className="w-fit text-lg font-semibold text-gray-800 uppercase tracking-wide mb-2 border-b-2 border-red-500">
        Información Personal
      </h2>

      {/* Si estamos editando, mostrar el formulario de edición */}
      {isEditing ? (
        <EditUserProfileForm 
          userData={userData}
          setIsEditing={setIsEditing}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-500">Nombre:</p>
            <p className="text-sm font-medium text-gray-700">{name} {surname}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Email:</p>
            <p className="text-sm font-medium text-gray-700">{email}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Ciudad:</p>
            <p className="text-sm font-medium text-gray-700">{city}, {province}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Dirección:</p>
            <p className="text-sm font-medium text-gray-700">{address}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">País:</p>
            <p className="text-sm font-medium text-gray-700">{country}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">CUIT:</p>
            <p className="text-sm font-medium text-gray-700">{cuit}</p>
          </div>
        </div>
      )}

      {/* Botón para editar datos */}
      {!isEditing && (
        <div className="flex justify-end">
          <button
            onClick={() => setIsEditing(true)} // Activa el modo de edición
            className="mt-4 bg-red-500 text-white text-sm font-semibold px-4 py-2 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 transition duration-200"
          >
            Editar Datos
          </button>
        </div>
      )}
    </section>
  );
}

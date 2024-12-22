"use client";

import { useState } from "react";
import Image from "next/image";

const Local = () => {
  // Imágenes de ejemplo para la galería
  const galleryImages = [
    "/local/nippongame-local-av-corrientes.jpeg",
    "/local/nippongame-imagen-local.jpeg",
  ];

  const [isOpen, setIsOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState("");

  const openImage = (src) => {
    setCurrentImage(src);
    setIsOpen(true);
  };

  const closeImage = () => {
    setIsOpen(false);
    setCurrentImage("");
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-4 pt-10">
      <div className="w-full max-w-6xl mb-10 text-center">
      <div className="text-center mb-5">
        <h1 className="text-3xl font-bold">Nuestro local</h1>
        <div className="inline-block w-24 h-1 bg-red-500 mt-2"></div>
      </div>        <p className="text-md text-gray-600">
          Descubre nuestro local y lo que tenemos para ofrecerte. 
        </p>
      </div>

{/* Galería de imágenes */}
<div className="flex flex-wrap justify-center items-center gap-8 mb-10">
  {galleryImages.map((src, index) => (
    <div
      key={index}
      className="relative overflow-hidden rounded-lg transition-shadow duration-700 transform shadow-md shadow-gray-400 hover:shadow-lg hover:shadow-gray-700 cursor-pointer"
      onClick={() => openImage(src)} // Abrir imagen al hacer clic
    >
      <Image
        src={src}
        alt={`Imagen ${index + 1} Nippongame local Av. corrientes`}
        width={300}
        height={200}
        className="object-cover w-full"
      />
    </div>
  ))}
</div>


      {/* Información y ubicación */}
      <div className="w-full max-w-6xl text-center mb-5">
      <div className="text-center mb-5">
        <h2 className="text-3xl font-bold">Ubicación</h2>
        <div className="inline-block w-24 h-1 bg-red-500 mt-2"></div>
      </div>
        <p className="text-md text-gray-600 mb-6">
          Estamos ubicados en Av. Corrientes 2416, C1046AAP Cdad. Autónoma de Buenos Aires. Visítanos y disfruta de una experiencia única.
        </p>

        {/* Mapa de ubicación */}
        <div className="w-full h-64">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.8354345093394!2d-58.42273531531682!3d-34.599279979751584!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bccab6c63a3757%3A0x5045675218ceed0!2sAv.%20Corrientes%202416%2C%20C1046AAP%20Cdad.%20Aut%C3%B3noma%20de%20Buenos%20Aires!5e0!3m2!1ses-419!2sar!4v1619166016326!5m2!1ses-419!2sar"
            width="100%"
            height="100%"
            allowFullScreen
            loading="lazy"
            className="rounded-lg"
          ></iframe>
        </div>
      </div>

      {/* Pop-up para la imagen a pantalla completa */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
          onClick={closeImage} // Cerrar al hacer clic fuera de la imagen
        >
          <div className="relative">
            <Image
              src={currentImage}
              alt="Imagen ampliada"
              width={800} // Ajustar según el tamaño deseado
              height={600}
              className="object-cover rounded-lg"
            />
          </div>
        </div>
      )}
    </main>
  );
};

export default Local;

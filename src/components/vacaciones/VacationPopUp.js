"use client";
import { useState, useEffect } from "react";
import Image from "next/image";

export default function VacationPopup() {
  const [isVisible, setIsVisible] = useState(false);

  // Mostrar el popup tras 1.5 segundos si no está en sessionStorage
  useEffect(() => {
    if (!sessionStorage.getItem("vacationPopupDismissed")) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  // Cerrar el popup y guardar estado en sessionStorage
  const handleClose = () => {
    setIsVisible(false);
    sessionStorage.setItem("vacationPopupDismissed", "true");
  };

  // Cerrar el popup si el clic es fuera del modal
  const handleOutsideClick = (e) => {
    if (e.target.id === "popup-background") {
      handleClose();
    }
  };

  return (
    isVisible && (
      <div
        id="popup-background"
        className="fixed inset-0 flex items-center justify-center bg-slate-500/30 backdrop-blur-md z-50"
        onClick={handleOutsideClick}
      >
        <div className="relative bg-[#0D1117] text-white p-8 rounded-lg shadow-slate-400 shadow-2xl w-[80%] max-w-sm sm:max-w-md text-center border border-white/10">
          {/* Fondo con luces centradas */}
          <div className="absolute inset-0 bg-gradient-radial from-red-500/40 via-red-500/20 to-transparent opacity-80 rounded-lg pointer-events-none"></div>

          {/* Logo central con imágenes laterales */}
          <div className="flex items-center justify-center mb-8 relative z-10">
            <Image
              src="/proximamente/sonic-nippongame.png"
              alt="Sonic Nippon Game"
              width={40}
              height={40}
              className="object-contain pt-5"
            />
            <Image
              src="/proximamente/nippon-game-logo.png"
              alt="Logo Nippon Game"
              width={300}
              height={80}
              className="object-contain mx-4"
              priority
            />
            <Image
              src="/proximamente/mario-nippongame.png"
              alt="Mario Nippon Game"
              width={50}
              height={50}
              className="object-contain pt-7"
            />
          </div>

          {/* Mensaje principal */}
          <h2 className="text-xl sm:text-2xl font-extrabold mb-4 relative z-10 text-red-500">
            ¡Nos vamos de vacaciones!
          </h2>
          <p className="mb-8 text-sm sm:text-base relative z-10">
            Nuestro ecommerce estará de vacaciones hasta el{" "}
            <strong className="underline decoration-white">
              03 de febrero de 2025
            </strong>. Mientras tanto, puedes explorar nuestros productos y armar
            tu pedido.
          </p>

          {/* Botón de cierre */}
          <button
            className="bg-red-500 text-white px-4 py-2 rounded-full font-bold hover:bg-red-700 transition relative z-10"
            onClick={handleClose}
          >
            Cerrar
          </button>
        </div>
      </div>
    )
  );
}

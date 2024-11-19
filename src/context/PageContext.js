"use client"

import { createContext, useContext, useState, useEffect } from "react";

// Crear el contexto
const PageContext = createContext();

// Crear el proveedor del contexto
export const PageProvider = ({ children }) => {
  const [currentPage, setCurrentPage] = useState(1);

  // Si deseas mantener la página entre sesiones, puedes guardar y recuperar el estado desde localStorage o sessionStorage
  useEffect(() => {
    const savedPage = sessionStorage.getItem("currentPage");
    if (savedPage) {
      setCurrentPage(Number(savedPage));
    }
  }, []);

  useEffect(() => {
    sessionStorage.setItem("currentPage", currentPage);
  }, [currentPage]);

  return (
    <PageContext.Provider value={{ currentPage, setCurrentPage }}>
      {children}
    </PageContext.Provider>
  );
};

// Custom hook para acceder al contexto
export const usePage = () => useContext(PageContext);

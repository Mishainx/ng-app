"use client"
import { useState, useEffect } from 'react';
import SideBarAdmin from './SideBarAdmin';
import ContentAdmin from './ContentAdmin';

const Dashboard = () => {
  const [selectedContent, setSelectedContent] = useState('products');
  const [resetView, setResetView] = useState(0);  // Estado para forzar el reinicio del contenido

  // Función onSelect que actualiza el estado y resetea el contenido
  const onSelect = (content) => {
    setSelectedContent(content);
    setResetView(prevView => prevView + 1);
  };

  return (
    <div className="flex min-h-screen">
      <SideBarAdmin onSelect={onSelect} />
      <ContentAdmin resetView={resetView} selectedContent={selectedContent} />
    </div>
  );
};

export default Dashboard;

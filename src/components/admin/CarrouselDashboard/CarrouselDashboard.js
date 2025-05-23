import { useEffect, useState } from 'react';
import CarrouselTable from './CarrouselTable';

const CarrouselDashboard = ({ resetView }) => {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch data from API
    const fetchSlides = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/slides`); // Cambia la URL si es necesario
        const data = await response.json();
        if (data?.message === "success") {
          setSlides(data.payload);
        }
      } catch (error) {
        console.error("Error fetching slides:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSlides();
  }, []);

  if (loading) {
    return (
      <div className="text-center text-gray-500">
        Cargando slides...
      </div>
    );
  }

  return (
    <CarrouselTable slides={slides} />
  );
};

export default CarrouselDashboard;

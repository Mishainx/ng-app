import { useEffect, useState } from 'react';
import CardsTable from './CardsTable';

const CardsDashboard = ({ resetView }) => {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch data from API
    const fetchSlides = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cards`); // Cambia la URL si es necesario
        const data = await response.json();
        console.log(data)
        if (data?.message === "success") {
          setCards(data.payload);
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
        Cargando cards...
      </div>
    );
  }

  return (
    <CardsTable cards={cards}/>
  );
};

export default CardsDashboard;

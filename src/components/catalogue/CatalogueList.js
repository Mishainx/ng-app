import { useEffect,useState } from "react";
import ProductCard from "../product/productCard";
import ArrowIcon from "@/icons/ArrowIcon";

export default function CatalogueList({ products }) {
  const [visibleCount, setVisibleCount] = useState(20);
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); // Estado de carga
  

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/profile`, {
          method: "GET",
        });

        if (!response.ok) {
          setUserData(null);
          setLoading(false); // Detener el estado de carga
          return; // Salir si no es exitoso
        }

        const data = await response.json();
        setUserData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false); // Detener el estado de carga
      }
    };

    fetchUserProfile();
  }, []);

  if (loading) {
    return <p className="text-gray-500 text-sm">Cargando...</p>; // Mensaje de carga
  }

  if (error) {
    return <p className="text-red-500 text-sm">Error: {error}</p>;
  }
  // Mostrar inicialmente 20 productos

  // Función para cargar más productos
  const loadMore = () => {
    setVisibleCount((prevCount) => prevCount + 20); // Aumentar en 20 el conteo visible
  };
  console.log(userData)
  return (
    <div>
      {/* Usar grid para alinear las tarjetas */}
      <div className="grid grid-cols-2 xxs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-5 lg:gap-7 xxs:p-10">
        {products?.slice(0, visibleCount).map((product) => (
          <ProductCard key={product.id} product={product} user={userData} />
        ))}
      </div>

      {/* Mostrar enlace "Cargar más" si hay más productos por cargar */}
      <div>
        {visibleCount < products.length && (
          <span
            onClick={loadMore}
            className="mt-4 cursor-pointer hover:underline flex items-center justify-center gap-2"
          >
            Cargar más
            <ArrowIcon className={"w-3 h-3 transform rotate-90"} />
          </span>
        )}
      </div>
    </div>
  );
}

"use client"

import OffersProducts from "@/components/offers/offers";
import { useProducts } from "@/context/ProductsContext";
import CustomHero from "@/components/catalogue/CustomHero";

export default function Ofertas() {
  const { products, error } = useProducts(); // Obtener los productos desde el contexto

  // Filtrar productos que están en oferta (discount > 0)
  const offersProducts = products.filter((product) => product.discount > 0); 


  if (error) {
    return <p>Error: {error}</p>; // Mostrar un mensaje de error en caso de que haya un fallo
  }

  return (
    <main>
      <div className="h-full">
        {/* Banner responsivo */}
            <CustomHero title={"Ofertas!"} description={"Los mejores descuentos en nuestros productos"} img={"/catalogue/catalogue-img-nippongame.png"}/>

        {/* Componente de productos en oferta */}
        <OffersProducts offersProducts={offersProducts} />
      </div>
    </main>
  );
}

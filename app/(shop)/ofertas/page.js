import OffersProducts from "@/components/offers/offers";

export default async function Ofertas() {
 // El array vacío asegura que solo se ejecute una vez al montar el componente
 let url = `${process.env.NEXT_PUBLIC_API_URL}/api/products/offers`;
  
 const response = await fetch(url, { cache:"no-cache" }); // Ajusta la URL según sea necesario
 const data = await response.json();
 const offersProducts = data.payload;

  return (
    <main>
      <div className="h-full">
        {/* Banner responsivo */}
        <div className="relative w-full h-48 bg-cover bg-center overflow-hidden mb-6">
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <h2 className="text-3xl font-bold text-white text-center">¡Ofertas Especiales!</h2>
          </div>
        </div>

        {/* Componente de productos en oferta */}
        <OfferProducts offersProducts={offersProducts} />
      </div>
    </main>
  );
}

// Ofertas.js
import OfferProducts from "@/components/offers/offers";


export default async function Ofertas() {
  

  let offersProducts = [];

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/products/offers`,{next:{revalidate:1}}
    );
    const products = await response.json();
    offersProducts = products.payload;
  } catch (error) {
    console.error("Error fetching featured products:", error);
  }


  return (
    <main>
      <div className="h-full">
        {/* Banner responsivo */}
        <div className="relative w-full h-48 bg-cover bg-center overflow-hidden mb-6" style={{ backgroundImage: 'url("/ruta/a/tu/banner.jpg")' }}>
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <h2 className="text-3xl font-bold text-white text-center">¡Ofertas Especiales!</h2>
          </div>
        </div>

        {/* Componente de productos en oferta */}
        <OfferProducts offersProducts={offersProducts}/>
      </div>
    </main>
  );
}
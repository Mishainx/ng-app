import OffersProducts from "@/components/offers/offers";

export default async function Ofertas() {
  let offersProducts = [];

  try {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/products/offers`;
    const response = await fetch(url, { cache: "no-cache" }); // Ajusta la URL según sea necesario

    if (!response.ok) {
      throw new Error("Error al obtener los productos de oferta");
    }

    const data = await response.json();
    offersProducts = data.payload || []; // Asignamos un array vacío si no hay productos

  } catch (error) {
    console.error("Error fetching featured products:", error);
    // Puedes manejar el error de alguna manera, como mostrando un mensaje al usuario
    offersProducts = []; // O asignar un valor predeterminado en caso de error
  }

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
        <OffersProducts offersProducts={offersProducts} />
      </div>
    </main>
  );
}

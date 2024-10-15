import CatalogueData from "@/components/catalogue/CatalogueData";

export default async function Catalogo() {

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`, {next:{revalidate:3600}});
    if (!response.ok) {
      throw new Error('Error fetching product');
    }
    const data = await response.json();
    products = data.payload;

  } catch (error) {
    console.error("Error fetching product:", error);
    return (
      <main className="p-4">
        <h1 className="text-2xl font-bold">Error al cargar el producto</h1>
        <p className="text-red-500">No se pudo obtener la información del producto. Inténtalo más tarde.</p>
      </main>
    );
  }
  
  return (
    <main className="flex flex-col items-center justify-start min-h-screen py-10">
      {/* Título de la página */}
      <div className="relative text-center mb-6">
        <h1 className="text-4xl font-bold text-gray-900 inline-block relative">
          Catálogo
          <div className="absolute inset-x-0 -bottom-2 mx-auto w-full h-1 bg-red-500"></div>
        </h1>
      </div>
    <CatalogueData/>
    </main>
  );
}

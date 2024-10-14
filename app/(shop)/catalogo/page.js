import CatalogueContainer from "@/components/catalogue/CatalogueContainer";

export default async function Catalogo() {
  let products = [];
  let categories = [];
  let error = null;

  try {
    // Fetch de productos
    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/products`
    console.log(url)
    const productsResponse = await fetch(url);
    if (!productsResponse.ok) {
      throw new Error("Error al obtener los productos");
    }
    console.log(productsResponse)
    const productsData = await productsResponse.json();
    console.log(productsData)
    products = productsData.payload;

    // Fetch de categorías
    const categoriesResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories`);
    if (!categoriesResponse.ok) {
      throw new Error("Error al obtener las categorías");
    }
    const categoriesData = await categoriesResponse.json();
    categories = categoriesData.payload;
  } catch (err) {
    error = err.message; // Guarda el error si ocurre
    console.error(error); // Log del error para depuración
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

      {/* Manejo de error */}
      {error && <div className="text-red-500 mb-4">Error: {error}</div>}
    </main>
  );
}

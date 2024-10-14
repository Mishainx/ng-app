import CatalogueContainer from "@/components/catalogue/CatalogueContainer";

export default async function Catalogo() {
  let products = [];
  let categories = [];
  
  try {
    // Fetch de productos
    const productsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`);    
    if (!productsResponse.ok) {
      console.log(`${process.env.NEXT_PUBLIC_API_URL}/api/products`)
      throw new Error(`Error fetching products: ${productsResponse.statusText}`);
    }
    
    const productsData = await productsResponse.json();
    products = productsData.payload;

  } catch (error) {
    console.error("Failed to fetch products:", error);
    return <div>Error fetching products: {error.message}</div>; // Manejo del error
  }

  try {
    // Fetch de categorías
    const categoriesResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories`, { next: { revalidate: 3600 } });

    if (!categoriesResponse.ok) {
      throw new Error(`Error fetching categories: ${categoriesResponse.statusText}`);
    }
    
    const categoriesData = await categoriesResponse.json();
    categories = categoriesData.payload;

  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return <div>Error fetching categories: {error.message}</div>; // Manejo del error
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

      {/* Pasar productos y categorías al componente */}
      <CatalogueContainer products={products} categories={categories} />
    </main>
  );
}

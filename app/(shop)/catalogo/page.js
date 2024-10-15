import ProductList from "@/components/product/productList";

async function getCategories() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories`); // Ajusta la URL según sea necesario
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log(data);

    const categories = data.payload;
    return categories;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return null; // O ajusta esto según cómo quieras manejar el error en tu aplicación
  }
}


export default async function Catalogo() {
  const  categories = await getCategories()
  console.log(categories)

  return (
    <main className="flex flex-col items-center justify-start min-h-screen py-10">
      {/* Título de la página */}
      <div className="relative text-center mb-6">
        <h1 className="text-4xl font-bold text-gray-900 inline-block relative">
          Catálogo
          <div className="absolute inset-x-0 -bottom-2 mx-auto w-full h-1 bg-red-500"></div>
        </h1>
      </div>
      <ProductList/>
    </main>
  );
}

import ProductList from "@/components/product/productList";

export default async function Catalogo() {
  async function getProducts() {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`); // Ajusta la URL según sea necesario
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
  
      const data = await response.json();
  
      const products = data.payload;
      return products;
    } catch (error) {

      console.error("Error fetching products:", error);
      return null; // O ajusta esto según cómo quieras manejar el error en tu aplicación
    }
  }
  const products = await getProducts()

  return (
    <main className="w-full flex flex-col items-center justify-start min-h-screen py-10">
      {/* Título de la página */}
      <div className="relative text-center mb-6">
        <h1 className="text-4xl font-bold text-gray-900 inline-block relative">
          Catálogo
          <div className="absolute inset-x-0 -bottom-2 mx-auto w-full h-1 bg-red-500"></div>
        </h1>
      </div>
      <ProductList products={products} />
    </main>
  );
}

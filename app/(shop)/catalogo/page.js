import ProductList from "@/components/product/productList";

export default async function Catalogo() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`); // Ajusta la URL según sea necesario
  const data = await response.json();
  const products = data.payload;
  console.log(products)

  return (
    <main className="w-full flex flex-col items-center justify-start min-h-screen py-10">
      {/* Título de la página */}
      <div className="relative text-center mb-6">
        <h1 className="text-4xl font-bold text-gray-900 inline-block relative">
          Catálogo
          <div className="absolute inset-x-0 -bottom-2 mx-auto w-full h-1 bg-red-500"></div>
        </h1>
      </div>
      <ProductList products={products}/>
    </main>
  );
}

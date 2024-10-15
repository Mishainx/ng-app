import CatalogueContainer from "@/components/catalogue/CatalogueContainer";

export default async function Catalogo() {
  
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

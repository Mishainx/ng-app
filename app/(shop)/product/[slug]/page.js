import { capitalizeFirstLetter, formatPriceToUSD } from '@/utils/stringsManager';
import Image from 'next/image';
import Link from 'next/link';
capitalizeFirstLetter

export default async function ProductPage({ params }) {
  const { slug } = params;
  let product = null;

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/slug/${slug}`, { cache: "no-store" });
    
    // Verificar si la respuesta es válida
    if (!response.ok) {
      throw new Error('Error fetching product');
    }

    const data = await response.json();
    product = data.payload;
  } catch (error) {
    console.error("Error fetching product:", error);
    return (
      <main className="p-4">
        <h1 className="text-2xl font-bold">Error al cargar el producto</h1>
        <p className="text-red-500">No se pudo obtener la información del producto. Inténtalo más tarde.</p>
      </main>
    );
  }

  // Verificar si el producto es nulo o indefinido
  if (!product) {
    return (
      <main className="p-4">
        <h1 className="text-2xl font-bold">Producto no encontrado</h1>
      </main>
    );
  }

  return (
    <main className="p-10 max-w-6xl mx-auto">
      <div className="flex flex-col items-center md:flex-row md:items-start space-y-6 md:space-y-0">
        <div className="md:w-1/2">
          <Image
            src={product.img}
            alt={product.name}
            width={400}
            height={400}
            className="object-cover shadow-lg rounded-lg"
          />
        </div>
        <div className="md:w-1/2 md:pl-10">
          <h1 className="text-4xl font-bold mb-6 text-gray-800 text-center">{product.name.toUpperCase()}</h1>
          <p className="text-2xl text-center font-semibold text-red-500 mb-4">
            {formatPriceToUSD(product.price)}
          </p>
          <p className="text-base mb-4">
            <span className="font-medium text-gray-700">Presentación: </span>
            {capitalizeFirstLetter(product.shortDescription)}
          </p>
          <p className="text-base mb-4">
            <span className="font-medium text-gray-700">Descripción: </span>
            {capitalizeFirstLetter(product.longDescription)}
          </p>
          <p className="text-base mb-4">
            <span className="font-medium text-gray-700">Categoría: </span>
            {capitalizeFirstLetter(product.category)}
          </p>
          <p className="text-base mb-4">
  <span className="font-medium text-gray-700">Stock: </span>
  {product.stock ? 'Disponible' : 'Sin stock'}
</p>
          <p className="text-base mb-4">
            <span className="font-medium text-gray-700">Sku: </span>
            {product.sku}
          </p>

          <div className="flex justify-center space-x-4 mt-8 md:justify-start">
            <button className="px-6 py-3 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400">
              Agregar al carrito
            </button>
            <Link href="/catalogo">
              <button className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg shadow-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400">
                Volver a la tienda
              </button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

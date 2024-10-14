import ProductDetail from "@/components/product/productDetail";

export default async function ProductPage({ params }) {
  const { slug } = params;
  let product = null;

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/slug/${slug}`, {next:{revalidate:3600}});
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

  if (!product) {
    return (
      <main className="p-4">
        <h1 className="text-2xl font-bold">Producto no encontrado</h1>
      </main>
    );
  }

  return (
    <main className="p-10 max-w-6xl mx-auto">
      <ProductDetail product={product} />
    </main>
  );
}

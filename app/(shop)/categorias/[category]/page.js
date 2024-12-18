import CategoriesBanner from '@/components/categories/categoriesBanner';
import ProductsByCategoryContainer from '@/components/product/productByCategoryContainer';


export async function generateMetadata({ params }) {
  const category = params.category || "Categoría"; // Asume que `params` tiene una categoría dinámica
  const title = `Nippongame - ${category}`;
  const description = `Explora la mejor selección de productos en la categoría de ${category} en Nippongame. Encuentra lo que necesitas al mejor precio.`;
  return {
    title,
    description,
  };
}


export default async function Categories({ params }) {
  const selectedCategory = params.category;

    // Construir la URL según la disponibilidad de selectedCategory y selectedSubcategory
    let url = `${process.env.NEXT_PUBLIC_API_URL}/api/products/categories/${selectedCategory}`;
  
    const response = await fetch(url, { cache:"no-cache" }); // Ajusta la URL según sea necesario
    const data = await response.json();
    const products = data.payload;

  return (
    <main>
      <CategoriesBanner selectedCategory={selectedCategory}/>
      <section>
      <div className="relative text-center mb-2">
        <h2 className="text-2xl font-bold text-gray-900 inline-block relative my-2">
          Productos
          <div className="absolute inset-x-0 -bottom-2 mx-auto w-full h-1 bg-red-500"></div>
        </h2>
      </div>
      <ProductsByCategoryContainer  selectedCategory={selectedCategory} products={products}/>
    </section>
    </main>
  );
}

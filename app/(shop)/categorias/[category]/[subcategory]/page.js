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

export default function Subcategories({ params }) {
  const selectedCategory = params.category 
  const selectedSubcategory = params.subcategory;

  return (
    <main>
      <CategoriesBanner selectedCategory={selectedCategory} selectedSubcategory={selectedSubcategory}/>
      <section>
      <div className="relative text-center mb-2">
        <h2 className="text-2xl font-bold text-gray-900 inline-block relative my-2">
          Productos
          <div className="absolute inset-x-0 -bottom-2 mx-auto w-full h-1 bg-red-500"></div>
        </h2>
      </div>
      <ProductsByCategoryContainer  selectedCategory={selectedCategory} selectedSubcategory={selectedSubcategory}/>

    </section>
    </main>
  );
}

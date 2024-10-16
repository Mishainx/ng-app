import CategoriesBanner from '@/components/categories/categoriesBanner';
import ProductList from '@/components/product/productList';

export async function generateMetadata({ params }) {
  const category = params.category || "Categoría"; // Asume que `params` tiene una categoría dinámica
  const title = `Nippongame - ${category}`;
  const description = `Explora la mejor selección de productos en la categoría de ${category} en Nippongame. Encuentra lo que necesitas al mejor precio.`;

  return {
    title,
    description,
  };
}

export default function Categories({ params }) {
  const selectedCategory = params.category 
  const selectedSubcategory = params.subcategory;

  return (
    <main>
      <CategoriesBanner selectedCategory={selectedCategory}  selectedSubcategory={selectedSubcategory}/>
      <section>
        <h1>{selectedSubcategory}</h1>
      {/*<ProductList />*/}      
</section>
    </main>
  );
}

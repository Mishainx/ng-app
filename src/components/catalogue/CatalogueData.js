import CatalogueContainer from "@/components/catalogue/CatalogueContainer";

export default async function CatalogueData() {

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`,{cache:"no-store",next:{revalidate:3600}}); // Ajusta la URL según sea necesario
    const data = await response.json()
    const products = data.payload
  
    // Fetch de categorías
    const categoriesResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories`);
    const categoriesData = await categoriesResponse.json();
    const categories = categoriesData.payload;
  
  return (
<>

      {/* Pasar productos y categorías al componente */}
      <CatalogueContainer products={products} categories={categories} />
</>
  );
}

import ProductsByCategory from "./productsByCategory";

export default async function ProductsByCategoryContainer({ selectedCategory, selectedSubcategory }) {
  // Construir la URL según la disponibilidad de selectedCategory y selectedSubcategory
  let url = `${process.env.NEXT_PUBLIC_API_URL}/api/products/categories/${selectedCategory}`;
  
  // Si hay una subcategoría seleccionada, la añadimos a la URL
  if (selectedSubcategory) {
    url += `/${selectedSubcategory}`;
  }

  const response = await fetch(url, { next: { revalidate: 3600 } }); // Ajusta la URL según sea necesario
  const data = await response.json();
  const products = data.payload;

  return (
    <div className="w-full flex flex-wrap justify-center ">
      <ProductsByCategory products={products} />
    </div>
  );
}

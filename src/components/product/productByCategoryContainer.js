import ProductsByCategory from "./productsByCategory";

export default async function ProductsByCategoryContainer({selectedCategory,subcategory}) {

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/categories/${selectedCategory}`,{next:{revalidate:3600}}); // Ajusta la URL según sea necesario
    const data = await response.json()
    const products = data.payload
      return (
        <div className="w-full  flex flex-wrap justify-center">
            <ProductsByCategory products={products}/>
        </div>
      );
    }
import ProductsByCategory from "./productsByCategory";

export default async function ProductsByCategoryContainer({products }) {


  return (
    <div className="w-full flex flex-wrap justify-center ">
      <ProductsByCategory products={products} />
    </div>
  );
}
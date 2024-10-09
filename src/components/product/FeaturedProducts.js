

import products from "../../data/products.json";
import ProductCard from "./productCard";

const FeaturedProducts = async () => {

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`,{cache:"no-store"}); // Ajusta la URL según sea necesario
  const data = await response.json()
  const products = data.payload

  const featuredProducts = products?.filter((product) => product.featured);

  return (
    <section className=" py-10 px-2 mx-auto max-w-6xl">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold">Destacados</h2>
        <div className="inline-block w-24 h-1 bg-red-500 mt-2"></div>
      </div>
      <div className="relative flex justi items-center">

        <div
          className="flex items-center  justify-center *:overflow-x-auto whitespace-nowrap h-full w-full"
        >
          {featuredProducts.map((product, index) => (
            <div className="flex-shrink-0 w-36 h-64" key={`${product.id}-${index}`}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default FeaturedProducts;

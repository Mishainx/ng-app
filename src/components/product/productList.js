import ProductCard from "./productCard";
import ProductCard2 from "./productCard2";
import ProductCard3 from "./productCard2";


import products from '../../../src/data/products.json';

export default function ProductList() {
    return (
      <div className="w-full p-5 gap-4 flex flex-wrap justify-center items-stretch overflow-y-visiblemax-h-96 ">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
                {products.map(product => (
          <ProductCard2 key={product.id} product={product} />
        ))}
                        {products.map(product => (
          <ProductCard3 key={product.id} product={product} />
        ))}
      </div>
    );
  }
import ProductCard from './productCard';

import products from '../../../src/data/products.json';

export default function ProductList() {
    return (
      <div className="w-full p-5 gap-4 flex flex-wrap justify-center">
                        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    );
  }
import CatalogueContainer from '../catalogue/CatalogueContainer';
import ProductCard from './productCard';

export default async function ProductList() {

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`,{next:{revalidate:3600}}); // Ajusta la URL según sea necesario
  const data = await response.json()
  const products = data.payload
    return (
      <div className="w-full  flex flex-wrap justify-center">
          <CatalogueContainer products={products}/>              
          {/*}
                        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}*/}
      </div>
    );
  }
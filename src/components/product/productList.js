import CatalogueContainer from '../catalogue/CatalogueContainer';

export default async function ProductList() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`); // Ajusta la URL según sea necesario
  const data = await response.json();
  const products = data.payload;
  console.log(data.total)
  return (
    <div className="w-full flex flex-wrap justify-center">
      <p>{data.total}</p>
      <CatalogueContainer products={products} total={data.total} /> {/* Añadido el total para paginación */}
    </div>
  );
}

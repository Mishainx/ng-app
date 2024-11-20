import CatalogueContainer from '../catalogue/CatalogueContainer';

export default async function ProductList({products}) {
  return (
    <div className="w-full flex flex-wrap justify-center">
      <CatalogueContainer products={products} /> {/* Añadido el total para paginación */}
    </div>
  );
}

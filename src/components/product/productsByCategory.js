import ProductCard from "./productCard";

export default function ProductsByCategory({ products, selectedCategory, subcategory }) {
  return (
<div>
  {/* Usar grid para alinear las tarjetas */}
  <div className="grid grid-cols-2 xxs:grid-cols-2 ss:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-5 lg:gap-7 xxs:p-10">
    {products?.map((product) => (
      <ProductCard key={product.id} product={product}  />
    ))}
  </div>
</div>

  );
}

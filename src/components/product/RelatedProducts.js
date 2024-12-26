import { useProducts } from "@/context/ProductsContext";
import ProductsSlider from "./ProductsSlider";

export default function RelatedProducts({ relatedProducts }) {
  const { products } = useProducts();
  // Filtra los productos del contexto que coinciden con los SKUs proporcionados
  const filteredProducts = products.filter((product) =>
    relatedProducts.includes(product.sku)
  );


  return (
    <div className=" w-full mt-6">
      {filteredProducts.length > 0 ? (
        <ProductsSlider products={filteredProducts} title="Tal vez te interese" />
      ) : (
        <p className="text-gray-500 text-sm text-center">
          No hay productos relacionados disponibles en este momento.
        </p>
      )}
    </div>
  );
}

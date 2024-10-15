import ProductList from '@/components/product/productList';

export default function Categories({ params }) {
  const title = params

  return (
    <main>
      <section>
        <ProductList />
      </section>
    </main>
  );
}

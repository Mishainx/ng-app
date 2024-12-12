import ProductCard from "./productCard";

const NewFeatured = async () => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/featured`, { next: { revalidate: 3600 }});
        const featuredProducts = await response.json();
        console.log (response)

  return (
    <section className="w-11/12 py-10 px-4 mx-auto max-w-6xl">
        <div
          id="featured-slider"
          className="flex items-center h-80  overflow-x-hidden overflow-y-visible whitespace-nowrap scroll-smooth no-scrollbar"
        >
          {featuredProducts?.length > 0 ? (
            featuredProducts
              .map((product, index) => (
                <div
                  className="flex-shrink-0  rounded-lg p-4 whitespace-normal transform transition-transform duration-300 hover:scale-105 overflow-visible"
                  key={`${product.id}-${index}`}
                >
                  <ProductCard product={product} />
                </div>
              ))
          ) : (
            <p>No hay productos destacados disponibles.</p>
          )}
        </div>

    </section>
  );
};

export default NewFeatured;

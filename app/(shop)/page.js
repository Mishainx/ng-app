import CategoriesList from "../../src/components/home/categoriesList/categoriesList";
import HeroCarousel from "../../src/components/home/hero/hero";
import FeaturedProducts from "../../src/components/product/FeaturedProducts";
import NavCard from "../../src/components/product/navCard";

export const metadata = {
  title: "Nippon Game - Videojuegos",
  description: "Ecommerce mayorista de videojuegos",
  openGraph: {
    title: "Nippongame - Ecommerce mayorista experto en videojuegos",
    description: "Ecommerce mayorista experto en videojuegos",
    url: "https://www.nippongame.com.ar",
    images: [
      {
        url: "https://www.nippongame.com.ar/proximamente/nippon-game-logo.png",
        width: 1200,
        height: 630,
        alt: "Nippongame logo",
      },
    ],
  },
};

export default async function Home() {

  let featuredProducts = [];

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/products/featured`
    );

    const products = await response.json();
    featuredProducts = products.payload;
  } catch (error) {
    console.error("Error fetching featured products:", error);
  }

  return (
    <>
      <HeroCarousel />

      <main className="">
        <CategoriesList />
        <div className="w-full flex flex-row flex-wrap items-center justify-center gap-5">
          <NavCard
            imgSrc="/navCard/catalogo-nav-card.png"
            title="Catálogo"
            href="/catalogo"
          />
          <NavCard
            imgSrc="/navCard/local-nav-card.png"
            title="Local"
            href="/local"
          />
          <NavCard
            imgSrc="/navCard/catalogo-nav-card.png"
            title="Ofertas"
            href="/ofertas"
          />
        </div>
        {/* Pasar los productos destacados al componente */}
        <FeaturedProducts featuredProducts={featuredProducts} />
      </main>
    </>
  );
}

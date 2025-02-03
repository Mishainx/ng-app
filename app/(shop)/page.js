import VacationPopup from "@/components/vacaciones/VacationPopUp";
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

  return (
    <>
      <HeroCarousel />

      <main className="">
        <CategoriesList />
        <div className="w-full flex flex-row flex-wrap items-center justify-center gap-5">
          <NavCard
            imgSrc="/navCard/catalogo-nav-card.jpg"
            title="Catálogo"
            href="/catalogo"
          />
          <NavCard
            imgSrc="/navCard/local-nav-card.png"
            title="Local"
            href="/local"
          />
          <NavCard
            imgSrc="/navCard/ofertas-nippongame.jpg"
            title="Ofertas"
            href="/ofertas"
          />
        </div>

        <FeaturedProducts/>
      </main>
    </>
  );
}

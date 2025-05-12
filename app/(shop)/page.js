import CategoriesList from "../../src/components/home/categoriesList/categoriesList";
import FeaturedProducts from "../../src/components/product/FeaturedProducts";
import HeroCarousel from "@/components/Carrousel/Carrousel";
import NavigationCardsContainer from "@/components/NavigationCards/NavigationCardsContainer";

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
  let visibleSlides = [];

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/slides`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      console.error("Error fetching slides:", res.status);
    } else {
      const data = await res.json();
      visibleSlides = data.payload
        ?.filter((s) => s.visible)
        .sort((a, b) => a.order - b.order) || [];
      console.log("Fetched visible slides:", visibleSlides.length);
    }
  } catch (error) {
    console.error("Error fetching slides:", error);
  }

  return (
    <>
    
      <main className="">
        <HeroCarousel slides={visibleSlides} />
        <CategoriesList />
        <NavigationCardsContainer/>
        <FeaturedProducts/>
      </main>
    </>
  );
}

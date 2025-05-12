import  HeroCarousel from "@/components/Carrousel/Carrousel";
import CategoriesList from "@/components/home/categoriesList/categoriesList";
import NavigationCardsContainer from "@/components/NavigationCards/NavigationCardsContainer";
import FeaturedProducts from "@/components/product/FeaturedProducts";

export default async function CarrouselPage() {
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
    <main>
      <HeroCarousel slides={visibleSlides} />
      <CategoriesList/>
      <NavigationCardsContainer/>
      <FeaturedProducts/>
    </main>
  );
}

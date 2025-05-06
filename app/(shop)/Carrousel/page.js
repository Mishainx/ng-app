import HeroCarousel from "@/components/Carrousel/Carrousel";
import { cache } from "react";

export default async function CarrouselPage() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/slides`, {cache: "no-cache"});
  const data = await res.json();
  const visibleSlides = data.payload?.filter((s) => s.visible).sort((a, b) => a.order - b.order) || [];
  return (
    <main>
      <HeroCarousel slides={visibleSlides} />
    </main>
  );
}
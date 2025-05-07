import CardList from "./CardList";

export default async function NavigationCardsContainer() {


let visibleCards = [];

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cards`, {
      next: { revalidate: 60 }, // Revalidación cada 60 segundos
    });

    if (!res.ok) {
      console.error("Error fetching cards:", res.status);
    } else {
      const data = await res.json();
      visibleCards = data.payload
        ?.filter((c) => c.visible)
        .sort((a, b) => a.order - b.order) || [];
      console.log("Fetched visible cards:", visibleCards.length);
    }
  } catch (error) {
    console.error("Error fetching cards:", error);
  }

  return (
    <main>
      <CardList cards={visibleCards} />
    </main>
  );
}
import CardNavigation from "./CardNavigation";

export default function CardList({ cards }) {
  if (!cards.length) return <p className="text-center py-10">No hay cards disponibles.</p>;

  return (
    <div className="w-full min-h-screen flex justify-center items-center">
      <div className="flex flex-wrap justify-center items-center gap-4 md:gap-6  p-2 md:p-4 w-full ">
        {cards.map((card) => (
          <CardNavigation
            key={card.id}
            title={card.title}
            href={card.link}
            imgSrc={card.image1Url}
            imgHoverSrc={card.image2Url}
            content={card.content}
            fullPage={card.fullPage}
          />
        ))}
      </div>
    </div>
  );
}

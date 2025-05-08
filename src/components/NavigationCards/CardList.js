  import CardNavigation from "./CardNavigation";

  export default function CardList({ cards }) {
    if (!cards.length)
      return <p className="text-center py-10">No hay cards disponibles.</p>;

    const items = [];
    let tempRow = [];
    const flushRow = () => {
      if (tempRow.length) {
        const isIncompleteRow = tempRow.length < 3;
    
        items.push(
          <div
            key={`row-${items.length}`}
            className={`
              grid gap-4 w-full
              grid-cols-1 sm:grid-cols-2 md:grid-cols-3
              ${isIncompleteRow ? "justify-center md:justify-start" : ""}
            `}
          >
            {tempRow.map((card) => (
              <CardNavigation
                key={card.id}
                title={card.title}
                href={card.link}
                imgSrc={card.image1Url}
                imgHoverSrc={card.image2Url}
                content={card.content}
                fullPage={false}
              />
            ))}
          </div>
        );
        tempRow = [];
      }
    };
    
    

    for (const card of cards) {
      if (card.fullPage) {
        flushRow(); // cerrar fila previa
        items.push(
          <div key={card.id} className="w-full">
            <CardNavigation
              title={card.title}
              href={card.link}
              imgSrc={card.image1Url}
              imgHoverSrc={card.image2Url}
              content={card.content}
              fullPage={true}
            />
          </div>
        );
      } else {
        tempRow.push(card);
        if (tempRow.length === 3) flushRow();
      }
    }

    flushRow(); // cualquier sobrante

    return (
      <div className="w-full min-h-screen flex flex-col items-center gap-6 p-5 md:p-10 max-w-7xl mx-auto">
        {items}
      </div>
    );

  }

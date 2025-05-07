import { useState } from "react";
import Image from "next/image";
import TrashIcon from "@/icons/TrashIcon";
import EditIcon from "@/icons/EditIcon";
import SpinnerIcon from "@/icons/SpinnerIcon";

const CarrouselRow = ({ card, updateCard, onDelete }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm("¿Estás seguro de que querés eliminar esta card?")) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cards/${card.id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Error al eliminar la card");

      console.log("Card eliminada correctamente");

      // ✅ Llamar al callback para informar al padre
      if (onDelete) onDelete(card.id);

    } catch (error) {
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <tr className="border-b hover:bg-gray-50 transition">
      <td className="px-4 py-2">{card.order}</td>

      <td className="px-4 py-2">
        <div className="flex items-center justify-start w-full h-full">
          <Image 
            src={card.image1Url} 
            alt={card.title} 
            width={100} 
            height={100} 
            className="object-contain rounded" 
          />
        </div>
      </td>

      <td className="px-4 py-2">{card.title}</td>
      <td className="px-4 py-2">{card.link}</td>

      <td className="px-4 py-2 text-center">
        {card.visible ? '✅' : '❌'}
      </td>

      <td className="px-4 py-2 text-center">
        <div className="flex items-center justify-center gap-4">
    {/*      <button 
            onClick={() => updateCard(card)} 
            className="text-yellow-500 hover:text-yellow-600 transition"
            title="Editar"
          >
            <EditIcon className="h-5 w-5" />
          </button>
*/}
          <button 
            onClick={handleDelete} 
            className="text-red-500 hover:text-red-600 transition disabled:opacity-50"
            disabled={isDeleting}
            title="Eliminar"
          >
            {isDeleting ? (
              <SpinnerIcon className="h-5 w-5 animate-spin" />
            ) : (
              <TrashIcon className="h-5 w-5" />
            )}
          </button>
        </div>
      </td>
    </tr>
  );
};

export default CarrouselRow;

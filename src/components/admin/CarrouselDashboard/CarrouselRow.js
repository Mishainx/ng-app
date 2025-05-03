import { useState } from "react";
import Image from "next/image";
import TrashIcon from "@/icons/TrashIcon";
import EditIcon from "@/icons/EditIcon";
import SpinnerIcon from "@/icons/SpinnerIcon";

const CarrouselRow = ({ slide, updateSlide, onDelete }) => {
    const [isDeleting, setIsDeleting] = useState(false);
  
    const handleDelete = async () => {
      if (!confirm("¿Estás seguro de que querés eliminar este slide?")) return;
  
      setIsDeleting(true);
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/slides/${slide.id}`, {
          method: "DELETE",
        });
  
        if (!res.ok) throw new Error("Error al eliminar el slide");
  
        console.log("Slide eliminado correctamente");
  
        // ✅ Llamar al callback para informar al padre
        if (onDelete) onDelete(slide.id);
  
      } catch (error) {
        console.error(error);
      } finally {
        setIsDeleting(false);
      }
    };

  return (
    <tr className="border-b hover:bg-gray-50 transition">
      <td className="px-4 py-2">{slide.order}</td>

      <td className="px-4 py-2">
        <div className="flex items-center justify-start w-full h-full">
          <Image 
            src={slide.imgUrl} 
            alt={slide.title} 
            width={100} 
            height={100} 
            className="object-contain rounded" 
          />
        </div>
      </td>

      <td className="px-4 py-2">{slide.title}</td>
      <td className="px-4 py-2">{slide.ctaText}</td>

      <td className="px-4 py-2 text-center">
        {slide.active ? '✅' : '❌'}
      </td>

      <td className="px-4 py-2 text-center">
        <div className="flex items-center justify-center gap-4">
          <button 
            onClick={() => updateSlide(slide)} 
            className="text-yellow-500 hover:text-yellow-600 transition"
            title="Editar"
          >
            <EditIcon className="h-5 w-5" />
          </button>

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

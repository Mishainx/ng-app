import { useState } from 'react';
import CarrouselRow from './CarrouselRow';
import SlideFormModal from './SlideFormModal';
import { toast } from 'react-toastify';

const CarrouselTable = ({ slides = [] }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSlide, setSelectedSlide] = useState(null);
  const [localSlides, setLocalSlides] = useState(slides);
  const itemsPerPage = 10;

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentSlides = localSlides.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(localSlides.length / itemsPerPage);

  const openModal = (slide = null) => {
    setSelectedSlide(slide);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedSlide(null);
  };

  const handleDeleteSlide = (deletedId) => {
    setLocalSlides((prev) => prev.filter((slide) => slide.id !== deletedId));
  };

  const handleUpdateSlide = async ({ id, data }) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/slides/${id}`, {
        method: 'PUT',
        body: data,
      });

      if (!response.ok) throw new Error('Error al actualizar el slide');
      const result = await response.json();

      if (result?.slide) {
        setLocalSlides((prev) =>
          prev.map((slide) =>
            slide.id === result.slide.id ? result.slide : slide
          )
        );
        toast.success('Slide actualizado con éxito');
        closeModal(); // ✅ cerrar modal después de actualizar
      } else {
        toast.error('No se recibió el slide actualizado desde el servidor');
      }
      
    } catch (error) {
      console.error('Error al actualizar el slide:', error);
      toast.error('Error al actualizar el slide');
    }
  };

  const createSlide = async (newData) => {
    const slideData = newData.data
    console.log(slideData)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/slides`, {
        method: 'POST',
        body: slideData,
      });

      if (!response.ok) throw new Error('Error al crear el slide');
      const result = await response.json();

      if (result?.slide) {
        setLocalSlides((prev) => [...prev, result.slide]);
        toast.success('Slide creado con éxito');
        closeModal(); // ✅ cerrar modal después de crear
      } else {
        console.warn('La respuesta del servidor no incluyó la nueva slide:', result);
        toast.error('La respuesta del servidor no incluyó la nueva slide');
      }
    } catch (error) {
      console.error('Error al crear el slide:', error);
      toast.error('Error al crear el slide');
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl overflow-x-auto flex flex-col gap-5">
      <h2 className="text-lg font-semibold">Slides del Carrusel</h2>

      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => openModal()}
          className="bg-red-500 text-white text-sm px-4 py-2 rounded hover:bg-red-700 transition"
        >
          + Agregar Slide
        </button>
      </div>

      {localSlides.length === 0 ? (
        <div className="text-center text-gray-500">No hay slides disponibles.</div>
      ) : (
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-600 font-semibold">
            <tr>
              <th className="px-4 py-3 text-left">Orden</th>
              <th className="px-4 py-3 text-left">Imagen</th>
              <th className="px-4 py-3 text-left">Título</th>
              <th className="px-4 py-3 text-left">CTA</th>
              <th className="px-4 py-3 text-center">Activo</th>
              <th className="px-4 py-3 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {currentSlides.map((slide) => (
              <CarrouselRow
                key={slide.id}
                slide={slide}
                openEditModal={openModal}
                onDelete={handleDeleteSlide}
                updateSlide={handleUpdateSlide}
              />
            ))}
          </tbody>
        </table>
      )}

      {localSlides.length > itemsPerPage && (
        <div className="mt-4 flex justify-between items-center text-sm">
          <span>Página {currentPage} de {totalPages}</span>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
            >
              Anterior
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}

      <SlideFormModal
        open={modalOpen}
        onClose={closeModal}
        slide={selectedSlide}
        onSave={(data) => {
          if (selectedSlide) {
            handleUpdateSlide(data);
          } else {
            createSlide(data);
          }
        }}
      />
    </div>
  );
};

export default CarrouselTable;

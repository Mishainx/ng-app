import { useState } from 'react';
import CardsRow from './CardsRow';
import CardFormModal from './CardFormModal';
import EditCardModal from "./EditCardModal";


const CardsTable = ({ cards = [],  deleteCard }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [localCards, setLocalCards] = useState(cards);
  const [shouldResetForm, setShouldResetForm] = useState(false);
  const [editingCard, setEditingCard] = useState(null);
const [showEditModal, setShowEditModal] = useState(false);

  const itemsPerPage = 10;

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentCards = localCards.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(localCards.length / itemsPerPage);

  const openModal = (card = null) => {
    setSelectedCard(card);
    setModalOpen(true);
  };

  const handleEdit = (card) => {
    setEditingCard(card);
    setShowEditModal(true);
  };

  const handleUpdateCard = (updatedCard) => {
    setLocalCards((prevCards) =>
      prevCards.map((card) =>
        card.id === updatedCard.id ? updatedCard : card
      )
    );
  };
  
  const handleCloseModal = () => {
    setEditingCard(null);
    setShowEditModal(false);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedCard(null);
  };

  const handleDeleteCard = (deletedId) => {
    setLocalCards((prev) => prev.filter((card) => card.id !== deletedId));
  };

  const updateCard = async (formData) => {
    try {
      const id = formData.get('id');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cards/${id}`, {
        method: 'PUT',
        body: formData,
      });
  
      if (!response.ok) throw new Error('Error al actualizar la card');
  
      const result = await response.json();
      console.log(result)
  
      if (result?.card) {
        // Actualizar el estado local con la card actualizada
        setLocalCards((prev) =>
          prev.map((card) =>
            card.id === result.card.id ? result.card : card
          )
        );
  
        // Cerrar el modal si la actualización fue exitosa
        handleCloseModal();
      } else {
        console.warn('La respuesta del servidor no incluyó la card actualizada:', result);
      }
    } catch (error) {
      console.log(error)
      console.error('Error al actualizar la card:', error);
    }
  };
  
  
  

  const createCard = async (newData) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cards`, {
        method: 'POST',
        body: newData,
      });
  
      if (!response.ok) throw new Error('Error al crear el card');
  
      const result = await response.json();
  
      if (result?.card) {
        setLocalCards((prev) => [...prev, result.card]);
        setShouldResetForm(true); // 🚀 indicar reseteo
        closeModal();
      } else {
        console.warn('La respuesta del servidor no incluyó la nueva card:', result);
      }
    } catch (error) {
      console.error('Error al crear el card:', error);
    }
  };
  
  
  return (
    <div className="bg-white p-6 rounded-xl overflow-x-auto flex flex-col gap-5">
      <h2 className="text-lg font-semibold">Cards de navegación</h2>

      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => openModal()}
          className="bg-red-500 text-white text-sm px-4 py-2 rounded hover:bg-red-700 transition"
        >
          + Agregar Card
        </button>
      </div>

      {localCards.length === 0 ? (
        <div className="text-center text-gray-500">No hay cards disponibles.</div>
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
            {currentCards.map((card) => (
              <CardsRow
                key={card.id}
                card={card}

  updateCard={handleEdit}
                onDelete={handleDeleteCard}
              />
            ))}
          </tbody>
        </table>
      )}

      {localCards.length > itemsPerPage && (
        <div className="mt-4 flex justify-between items-center text-sm">
          <span>Página {currentPage} de {totalPages}</span>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
            >
              Anterior
            </button>
            <button
              onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}

<CardFormModal
  open={modalOpen}
  onClose={closeModal}
  card={selectedCard}
  resetAfterSave={shouldResetForm}
  clearResetFlag={() => setShouldResetForm(false)}
  onSave={(data) => {
    if (selectedCard) {
      updateCard(data);
      closeModal();
    } else {
      createCard(data); // closeModal() se llama dentro si es exitoso
    }
  }}
/>

{showEditModal && (
  <EditCardModal
    open={showEditModal}
    onClose={handleCloseModal}
    card={editingCard}
    onSave={updateCard}
  />
)}

    </div>
  );
};

export default CardsTable;

import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useTickets } from '@/context/TicketsContext';

const CancelTicketModal = ({ isOpen, onClose, ticketId, isCanceled, cancelReason }) => {
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { cancelTicket } = useTickets();

  // Si el ticket está cancelado, setea el reason en el cancelReason para mostrarlo en el modal
  useEffect(() => {
    if (isCanceled && cancelReason) {
      setReason(cancelReason);
    } else {
      setReason('');
    }
  }, [isCanceled, cancelReason]);

  // Función que maneja la cancelación o restauración del ticket
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (reason.length === 0 && !isCanceled) {
      toast.error('Por favor ingrese un motivo de cancelación.');
      return;
    }

    if (reason.length > 150) {
      toast.error('El motivo no puede exceder los 150 caracteres.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Si el ticket está cancelado, se restaura, sino se cancela
      const action = isCanceled ? 'restaurar' : 'cancelar';
      await cancelTicket(ticketId, reason, isCanceled);

      // Si el ticket es restaurado, vaciar el motivo
      if (action === 'restaurar') {
        setReason('');
      }

      onClose(); // Cerrar el modal después de la operación

      toast.success(`Ticket ${action === 'cancelar' ? 'cancelado' : 'restaurado'} con éxito.`);
    } catch (error) {
      console.error(error);
      toast.error('Hubo un error al procesar el ticket. Intenta nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
};


  return (
    isOpen && (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-full h-full sm:w-96 sm:h-auto sm:max-h-full">
          <h2 className="text-xl font-semibold mb-4">
            {isCanceled ? 'Restaurar Ticket' : 'Cancelar Ticket'}
          </h2>

          {/* Mostrar campo de motivo solo si no está cancelado */}
          {!isCanceled && (
            <div>
              <label className="block text-sm font-medium mb-2" htmlFor="reason">
                Motivo de la cancelación:
              </label>
              <textarea
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows="4"
                className="w-full border border-gray-300 rounded-md p-2 mb-4"
                placeholder="Ingrese el motivo de la cancelación (max 150 caracteres)"
              />
            </div>
          )}

          <div className="flex justify-end space-x-4">
            <button
              onClick={onClose}
              className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600"
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? isCanceled
                  ? 'Restaurando...'
                  : 'Cancelando...'
                : isCanceled
                ? 'Restaurar Ticket'
                : 'Cancelar Ticket'}
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default CancelTicketModal;

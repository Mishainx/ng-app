import { useEffect, useState } from 'react';
import Image from 'next/image';

const EditCardModal = ({ open, onClose, card, onSave }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    link: '',
    order: '1',
    visible: true,
    fullPage: false,
    image1: null,
    image2: null,
  });

  const [preview1, setPreview1] = useState(null);
  const [preview2, setPreview2] = useState(null);

  useEffect(() => {
    if (card) {
      setFormData({
        title: card.title || '',
        content: card.content || '',
        link: card.link || '',
        order: card.order?.toString() || '1',
        visible: card.visible ?? true,
        fullPage: card.fullPage ?? false,
        image1: null,
        image2: null,
      });
      setPreview1(card.image1Url || null);
      setPreview2(card.image2Url || null);
    }
  }, [card]);

  const handleChange = (e) => {
    const { name, type, checked, value, files } = e.target;

    if (type === 'file') {
      const file = files[0];
      setFormData((prev) => ({ ...prev, [name]: file }));

      const reader = new FileReader();
      reader.onloadend = () => {
        if (name === 'image1') setPreview1(reader.result);
        else if (name === 'image2') setPreview2(reader.result);
      };
      if (file) reader.readAsDataURL(file);
    } else if (type === 'checkbox') {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if ((key === 'image1' || key === 'image2') && value) {
        data.append(key, value);
      } else if (key === 'visible' || key === 'fullPage') {
        data.append(key, value ? '1' : '0');
      } else {
        data.append(key, value);
      }
    });
  
    if (card?.id) data.append('id', card.id);  // Asegúrate de que el ID se pase correctamente
    onSave(data);  // Pasa los datos al método onSave de CardsTable
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md max-h-[90vh] p-4 overflow-y-auto">
        <h2 className="text-base font-semibold mb-3">
          Editar Card
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3 text-sm">
          <Input label="Título" name="title" value={formData.title} onChange={handleChange} required />
          <Input label="Contenido" name="content" value={formData.content} onChange={handleChange} required />
          <Input label="Enlace" name="link" value={formData.link} onChange={handleChange} required />
          <input
            type="number"
            name="order"
            value={formData.order}
            onChange={handleChange}
            required
            min={1}
            step={1}
            className="mt-1 w-full border rounded px-2 py-1"
          />

          <div className="flex items-center gap-2">
            <input type="checkbox" name="visible" checked={formData.visible} onChange={handleChange} />
            <label className="text-sm">Mostrar card</label>
          </div>

          <div className="flex items-center gap-2">
            <input type="checkbox" name="fullPage" checked={formData.fullPage} onChange={handleChange} />
            <label className="text-sm">Página completa</label>
          </div>

          <div>
            <label className="block font-medium text-sm">Imagen principal</label>
            <input
              type="file"
              name="image1"
              accept="image/*"
              onChange={handleChange}
              className="mt-1"
            />
            {preview1 && (
              <div className="mt-2 relative w-full h-40">
                <Image
                  src={preview1}
                  alt="Vista previa 1"
                  fill
                  className="object-contain rounded border"
                />
              </div>
            )}
          </div>

          <div>
            <label className="block font-medium text-sm">Imagen secundaria (opcional)</label>
            <input
              type="file"
              name="image2"
              accept="image/*"
              onChange={handleChange}
              className="mt-1"
            />
            {preview2 && (
              <div className="mt-2 relative w-full h-40">
                <Image
                  src={preview2}
                  alt="Vista previa 2"
                  fill
                  className="object-contain rounded border"
                />
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-700"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Input = ({ label, name, value, onChange, type = 'text', required = false }) => (
  <div>
    <label className="block font-medium text-sm">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      className="mt-1 w-full border rounded px-2 py-1"
    />
  </div>
);

export default EditCardModal;
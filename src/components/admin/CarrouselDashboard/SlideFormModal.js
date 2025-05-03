import { useEffect, useState } from 'react';
import Image from 'next/image';

const SlideFormModal = ({ open, onClose, slide, onSave }) => {
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    ctaText: '',
    ctaLink: '',
    ctaColor: '',
    overlay: '',
    order: '',
    visible: true,
    imagen: null, // 👈 Cambiamos 'image' a 'imagen' para que coincida con el backend
  });
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (slide) {
      setFormData({
        title: slide.title || '',
        subtitle: slide.subtitle || '',
        ctaText: slide.ctaText || '',
        ctaLink: slide.ctaLink || '',
        ctaColor: slide.ctaColor || '',
        overlay: slide.overlay || '',
        order: slide.order || '',
        visible: slide.visible ?? true,
        imagen: null, // 👈 Mantenemos 'imagen'
      });
      setPreview(slide.imgUrl || null);
    } else {
      setFormData({
        title: '',
        subtitle: '',
        ctaText: '',
        ctaLink: '',
        ctaColor: '',
        overlay: '',
        order: '',
        visible: true,
        imagen: null, // 👈 Mantenemos 'imagen'
      });
      setPreview(null);
    }
  }, [slide]);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === 'file') {
      const file = files[0];
      setFormData((prev) => ({ ...prev, imagen: file })); // 👈 Cambiamos 'img' a 'imagen'
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => setPreview(reader.result);
        reader.readAsDataURL(file);
      }
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
      if (key === 'imagen' && value) { // 👈 Cambiamos 'img' a 'imagen'
        data.append('imagen', value); // 👈 Cambiamos 'img' a 'imagen'
      } else {
        data.append(key, value);
      }
    });
    if (slide?.id) data.append('id', slide.id);
    onSave(data);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md max-h-[90vh] p-4 overflow-y-auto">
        <h2 className="text-base font-semibold mb-3">
          {slide ? 'Editar Slide' : 'Nuevo Slide'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3 text-sm">
          <Input label="Título" name="title" value={formData.title} onChange={handleChange} required />
          <Input label="Subtítulo" name="subtitle" value={formData.subtitle} onChange={handleChange} required />
          <Input label="Texto CTA" name="ctaText" value={formData.ctaText} onChange={handleChange} required/>
          <Input label="Link CTA" name="ctaLink" value={formData.ctaLink} onChange={handleChange} required/>
          <Input label="Color CTA (Tailwind)" name="ctaColor" value={formData.ctaColor} onChange={handleChange} />
          <Input label="Overlay (Tailwind)" name="overlay" value={formData.overlay} onChange={handleChange} />
          <Input label="Orden" name="order" value={formData.order} onChange={handleChange} type="number" required />

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="visible"
              checked={formData.visible}
              onChange={handleChange}
            />
            <label className="text-sm">Mostrar slide</label>
          </div>

          <div>
            <label className="block font-medium text-sm">Imagen</label>
            <input
              type="file"
              name="imagen" // 👈 Cambiamos 'img' a 'imagen'
              accept="image/*"
              onChange={handleChange}
              className="mt-1"
              required
            />
            {preview && (
              <div className="mt-2 relative w-full h-40">
                <Image
                  src={preview}
                  alt="Vista previa"
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

export default SlideFormModal;
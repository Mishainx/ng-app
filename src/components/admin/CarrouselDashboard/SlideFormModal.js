import { useEffect, useState } from 'react';
import Image from 'next/image';

const CTA_COLORS = {
  red: 'bg-red-500',
  blue: 'bg-blue-500',
  green: 'bg-green-500',
  yellow: 'bg-yellow-500',
  gray: 'bg-gray-500',
  black: 'bg-black',
  white: 'bg-white border text-black',
};

const OVERLAYS = {
  'bg-black/20': 'Oscuro (negro 20%)',
  'bg-black/30': 'Oscuro (negro 30%)',
  'bg-black/40': 'Oscuro (negro 40%)',
  'bg-black/50': 'Oscuro (negro 50%)',
  'bg-black/70': 'Oscuro (negro 70%)',
  'bg-white/20': 'Claro (blanco 20%)',
  'bg-white/30': 'Claro (blanco 30%)',
  'bg-white/40': 'Claro (blanco 40%)',
  'bg-white/60': 'Claro (blanco 60%)',
};

const SlideFormModal = ({ open, onClose, slide, onSave }) => {
  const [formData, setFormData] = useState({
    id: "",
    title: '',
    subtitle: '',
    ctaText: '',
    ctaLink: '',
    ctaColor: '',
    overlay: '',
    order: '',
    visible: true,
    image: null,
    position: ''
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
        image: null, // No se guarda la imagen al principio de la edición
        position: slide?.position || 'left',
        id: slide.id || '',  // Asegúrate de agregar la id al formData
      });
      setPreview(slide.imgUrl || null);  // Si tiene imagen, la asignamos a preview
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
        image: null,
        position: '',
        id: '', // Asegúrate de incluir el campo id también
      });
      setPreview(null);
    }
  }, [slide]);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === 'file') {
      const file = files[0];
      setFormData((prev) => ({ ...prev, image: file }));
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
      if (key === 'image' && value) {
        data.append('image', value);
      } else {
        data.append(key, value);
      }
    });
  
    if (formData.id) {
      data.append('id', formData.id);  // Asegurándote de enviar la id si existe
    }
  
    onSave({ id: formData.id, data }); // 👈
; // Enviar los datos al método onSave
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

          {/* CTA Color visual */}
          <div>
            <label className="block font-medium text-sm mb-1">Color del botón CTA</label>
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(CTA_COLORS).map(([key, classes]) => (
                <label key={key} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="ctaColor"
                    value={key}
                    checked={formData.ctaColor === key}
                    onChange={handleChange}
                    className="accent-current"
                  />
                  <div className={`w-6 h-6 rounded border ${classes}`} />
                  <span className="capitalize text-sm">{key}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Overlay visual */}
          <div>
            <label className="block font-medium text-sm mb-1">Overlay visual</label>
            <div className="grid grid-cols-1 gap-2">
              {Object.entries(OVERLAYS).map(([className, label]) => (
                <label key={className} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="overlay"
                    value={className}
                    checked={formData.overlay === className}
                    onChange={handleChange}
                  />
                  <div className={`w-12 h-6 rounded border ${className}`} />
                  <span className="text-sm">{label}</span>
                </label>
              ))}
            </div>
          </div>

          <input
  type="number"
  name="order"
  value={formData.order}
  onChange={handleChange}
  required
  min={0}              // ✅ evita negativos si no se permiten
  step={1}             // ✅ incrementos enteros
  className="mt-1 w-full border rounded px-2 py-1"
/>

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
  name="image"
  accept="image/*"
  onChange={handleChange}
  className="mt-1"
  required={!slide?.imgUrl}
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

          <div>
            <label className="block font-medium text-sm">Posición del contenido</label>
            <select
              name="position"
              value={formData.position || 'left'}
              onChange={handleChange}
              className="mt-1 w-full border rounded px-2 py-1"
            >
              <option value="left">Izquierda</option>
              <option value="center">Centro</option>
              <option value="right">Derecha</option>
              <option value="none">Ocultar contenido</option>
            </select>
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

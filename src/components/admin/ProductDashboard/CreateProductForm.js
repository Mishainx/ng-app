import { useState } from "react";
import { useProducts } from "@/context/ProductsContext";
import { useCategories } from "@/context/CategoriesContext";
import { capitalizeFirstLetter } from "@/utils/stringsManager";
import { toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import Image from "next/image";
import ButtonWithSpinner from "@/components/loader/ButtonWithSpinner";

const CreateProductForm = ({ setView }) => {
  const { addProduct } = useProducts();
  const { categories } = useCategories(); // Obtener las categorías desde el contexto
  const [productData, setProductData] = useState({
    name: "",
    sku: "",
    price: 0,
    stock: false, // Cambiar 'available' a 'stock'
    longDescription: "",
    shortDescription: "",
    img: null, // Cambiar para manejar el archivo directamente
    relatedProds: [],
    brand: null,
    visible: true,
    featured: false,
    gallery: [],
    slug: "",
    category: "", // Inicializar categoría como vacío
    subcategory: [], // Cambiar a array para almacenar múltiples subcategorías
    discount: 0, // 
  });

  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const createdProduct = await addProduct(productData);
      if (!createdProduct) {
        throw new Error("No se pudo crear el producto.");
      }
      toast.success("Producto creado exitosamente");
      // Redirigir a la vista de lista de productos
      setTimeout(() => {
        setView("list"); // Cambiar a la vista "list" después de un breve retraso
      }, 2000); // Retardo para ver el mensaje de éxito
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

const getSubcategories = (categorySlug) => {
  const selectedCategory = categories.find(cat => cat.slug === categorySlug);
  return selectedCategory?.subcategories ?? []; // Si no hay subcategorías, devolver un array vacío
};

  const isValidImageFile = (file) => {
    const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp", "image/bmp", "image/svg+xml"];
    return file && validTypes.includes(file.type);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0]; // Obtener el primer archivo seleccionado
    if (file && isValidImageFile(file)) {
      setProductData({ ...productData, img: file });
    } else {
      toast.error("Por favor selecciona una imagen válida.");
    }
  };

  const handleSubcategoryAdd = () => {
    if (selectedSubcategory && !productData.subcategories.includes(selectedSubcategory)) {
      setProductData((prevData) => ({
        ...prevData,
        subcategories: [...prevData.subcategories, selectedSubcategory]
      }));
      setSelectedSubcategory(""); // Limpiar la selección
    }
  };
  

  const handleSubcategoryRemove = (subcategorySlug) => {
    setProductData((prevData) => ({
      ...prevData,
      subcategories: prevData.subcategories.filter((sub) => sub !== subcategorySlug)
    }));
  };
  

  return (
    
    <form onSubmit={handleSubmit} className="bg-white shadow-md p-4 rounded-lg">

      <h2 className="text-xl font-semibold mb-4 text-gray-800">Crear Producto</h2>

      {/* Nombre */}
      <div className="mb-3">
        <label className="text-sm text-gray-700">Nombre</label>
        <input
          type="text"
          required
          className="border rounded w-full py-1 px-2"
          value={productData.name}
          onChange={(e) => setProductData({ ...productData, name: e.target.value })}
          placeholder="Ej. Auricular P105"
        />
      </div>

      {/* Precio */}
      <div className="mb-3">
        <label className="text-sm text-gray-700">Precio</label>
        <input
          required
          type="text" // Cambiar a tipo "text" para evitar los botones
          className="border rounded w-full py-1 px-2"
          value={productData.price}
          onChange={(e) => {
            const value = e.target.value;
            if (/^\d*\.?\d{0,2}$/.test(value) && parseFloat(value) >= 0) {
              setProductData({ ...productData, price: value });
            }
          }}
          placeholder="Ej. 2.00"
        />
      </div>

      {/* Descuento */}
      <div className="mb-3">
        <label className="text-sm text-gray-700">Descuento</label>
        <input
          type="text"
          className="border rounded w-full py-1 px-2"
          value={productData.discount}
          onChange={(e) => {
            const value = e.target.value;
            if (/^\d*\.?\d{0,2}$/.test(value) && parseFloat(value) >= 0) {
              setProductData({ ...productData, discount: value });
            }
          }}
          placeholder="Ej. 1.00"
        />
      </div>

      {/* Stock (Disponible) */}
      <div className="mb-3 flex flex-col">
        <label className="text-sm text-gray-700">Opciones</label>
        <label className="flex items-center text-sm text-gray-700">
          <input
            type="checkbox"
            checked={productData.stock} // Cambiar 'available' a 'stock'
            onChange={(e) => setProductData({ ...productData, stock: e.target.checked })}
            className="mr-2"
          />
          Stock Disponible
        </label>
        <label className="flex items-center text-sm text-gray-700">
          <input
            type="checkbox"
            checked={productData.visible}
            onChange={(e) => setProductData({ ...productData, visible: e.target.checked })}
            className="mr-2"
          />
          Visible
        </label>
        <label className="flex items-center text-sm text-gray-700">
          <input
            type="checkbox"
            checked={productData.featured}
            onChange={(e) => setProductData({ ...productData, featured: e.target.checked })}
            className="mr-2"
          />
          Destacado
        </label>
      </div>

      {/* Descripción Larga */}
      <div className="mb-3">
        <label className="text-sm text-gray-700">Descripción Larga</label>
        <textarea
          className="border rounded w-full py-1 px-2"
          value={productData.longDescription}
          onChange={(e) => setProductData({ ...productData, longDescription: e.target.value })}
          placeholder="Detalles adicionales sobre el producto"
          rows="2"
        />
      </div>

      {/* Descripción Corta */}
      <div className="mb-3">
        <label className="text-sm text-gray-700">Descripción Corta</label>
        <textarea
          className="border rounded w-full py-1 px-2"
          value={productData.shortDescription}
          onChange={(e) => {
            const value = e.target.value;
            if (value.length <= 30) {
              setProductData({ ...productData, shortDescription: value });
            }
          }}
          placeholder="Una breve descripción"
          rows="2"
        />
      </div>

      {/* Imagen */}
      <div className="mb-3">
        <label className="text-sm text-gray-700">Selecciona una Imagen</label>
        <input
          required
          type="file"
          accept="image/*"
          className="border rounded w-full py-1 px-2"
          onChange={handleImageChange}
        />
        {/* Vista previa de la imagen */}
        {productData.img && (
          <div className="mt-2 relative">
            <Image
              src={URL.createObjectURL(productData.img)} // Usando el objeto URL para crear la imagen local
              alt="Vista previa"
              layout="intrinsic" // Usando el layout intrinsic para mantener las proporciones
              width={500} // Puedes ajustar el tamaño según tus necesidades
              height={500} // Puedes ajustar el tamaño según tus necesidades
              className="max-w-full h-auto"
            />
          </div>
        )}
      </div>

      {/* Marca */}
      <div className="mb-3">
        <label className="text-sm text-gray-700">Marca</label>
        <input
          type="text"
          className="border rounded w-full py-1 px-2"
          value={productData.brand}
          onChange={(e) => {
            const value = e.target.value;
            if (value.length <= 30) { // Limita a 30 caracteres
              setProductData({ ...productData, brand: value || null });
            }
          }}
          placeholder="Ej. Marca del producto"
        />
      </div>

{/* Categoría */}
<div className="mb-3">
  <label className="text-sm text-gray-700">Categoría</label>
  <select
    className="border rounded w-full py-1 px-2"
    required
    value={productData.category}
    onChange={(e) => {
      const categorySlug = e.target.value;
      setProductData({
        ...productData,
        category: categorySlug,
        subcategories: [] // Limpiar las subcategorías seleccionadas al cambiar de categoría
      });
    }}
  >
    <option value="">Seleccionar Categoría</option>
    {categories.map((category) => (
      <option key={category.slug} value={category.slug}>
        {capitalizeFirstLetter(category.title)}
      </option>
    ))}
  </select>
</div>

{/* Subcategorías */}
{productData.category && (
  <div className="mb-3">
    <label className="text-sm text-gray-700">Subcategorías</label>
    <div className="flex gap-2">
      <select
        value={selectedSubcategory}
        onChange={(e) => setSelectedSubcategory(e.target.value)}
        className="border rounded w-full py-1 px-2"
      >
        <option value="">Seleccionar Subcategoría</option>
        {getSubcategories(productData.category).map((subcategory) => (
          <option key={subcategory.slug} value={subcategory.slug}>
            {capitalizeFirstLetter(subcategory.title)}
          </option>
        ))}
      </select>
      <button
        type="button"
        onClick={handleSubcategoryAdd}
        className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-700"
      >
        +
      </button>
    </div>

    {/* Lista de subcategorías añadidas */}
    <div className="flex flex-wrap gap-2 mt-2">
      {productData.subcategories.map((subcategorySlug) => {
        const subcategory = getSubcategories(productData.category).find(sub => sub.slug === subcategorySlug);
        return (
          <span
            key={subcategorySlug}
            className="flex items-center px-3 py-1 bg-gray-200 text-gray-800 rounded-full"
          >
            {capitalizeFirstLetter(subcategory?.title || subcategorySlug)}
            <button
              type="button"
              className="ml-2 text-red-500 hover:text-red-700"
              onClick={() => handleSubcategoryRemove(subcategorySlug)}
            >
              ✕
            </button>
          </span>
        );
      })}
    </div>
  </div>
)}


{/* Botones: Volver y Crear Producto */}
<div className="flex flex-col gap-4 w-full flex-wrap md:flex-row md:flex-nowrap">

  {/* Botón de envío */}
  <ButtonWithSpinner
    isLoading={isSubmitting}
    label="Crear Producto"
    loadingText="Creando producto..."
    onClick={handleSubmit}
    className=" sm:w-[300px]"
    padding="py-2 px-5"
  />
    {/* Botón de volver al menú */}
    <button
    type="button"
    onClick={() => setView("list")} // Cambiar la vista a la lista de productos
    className="bg-gray-500 text-white py-2 px-5 rounded hover:bg-gray-700  md:w-[150px]"
  >
    Volver al menú
  </button>
</div>



    </form>
  );
};

export default CreateProductForm;

import { useState } from "react";
import { useProducts } from "@/context/ProductsContext";
import { useCategories } from "@/context/CategoriesContext";
import { capitalizeFirstLetter } from "@/utils/stringsManager";
import TrashIcon from "@/icons/TrashIcon";
import PlusIcon from "@/icons/PlusIcon";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Image from "next/image";
import ButtonWithSpinner from "@/components/loader/ButtonWithSpinner";

const EditProductForm = ({ editingProduct, setView }) => {
  const { updateProduct } = useProducts();
  const { categories } = useCategories();
  const [productData, setProductData] = useState({
    ...editingProduct, // Inicializa los valores con el producto recibido
    img: null, // Para manejar una nueva imagen cargada, si aplica
  });

  const [selectedSubcategory, setSelectedSubcategory] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const updatedProduct = await updateProduct(productData); // Asume que `updateProduct` es la función para actualizar productos
      
    if (!updateProduct) {
        throw new Error("No se pudo actualizar el producto.");
      }  
      toast.success("Producto actualizado exitosamente");
      setTimeout(() => {
        setView("list"); // Cambiar a la vista "list" después de un breve retraso
      }, 2000); 
    } catch (error) {
      toast.error(error.message);
    }finally {
      setIsSubmitting(false);
    }
  };

  const getSubcategories = (categorySlug) => {
    const selectedCategory = categories.find(cat => cat.slug === categorySlug);
    return selectedCategory?.subcategories ?? []; // Si no hay subcategorías, devolver un array vacío
  };

  const isValidImageFile = (file) => {
    const validTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "image/bmp",
      "image/svg+xml",
    ];
    return file && validTypes.includes(file.type);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && isValidImageFile(file)) {
      setProductData({ ...productData, img: file });
    } else {
      toast.error("Por favor selecciona una imagen válida.");
    }
  };

  const handleSubcategoryAdd = () => {
    if (selectedSubcategory && !productData.subcategory?.includes(selectedSubcategory)) {
      setProductData((prevData) => ({
        ...prevData,
        subcategory: [...prevData?.subcategory, selectedSubcategory]
      }));


      setSelectedSubcategory([]); // Limpiar la selección
    }
  };
  const handleSubcategoryRemove = (subcategorySlug) => {
    setProductData((prevData) => ({
      ...prevData,
      subcategory: prevData.subcategory.filter((sub) => sub !== subcategorySlug)
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md p-4 rounded-lg">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Editar Producto</h2>

      {/* Nombre */}
      <div className="mb-3">
        <label className="text-sm text-gray-700">Nombre</label>
        <input
          type="text"
          className="border rounded w-full py-1 px-2"
          value={productData.name}
          onChange={(e) => setProductData({ ...productData, name: e.target.value })}
        />
      </div>

      {/* Precio */}
      <div className="mb-3">
        <label className="text-sm text-gray-700">Precio</label>
        <input
          type="text"
          className="border rounded w-full py-1 px-2"
          value={productData.price}
          onChange={(e) => {
            const value = e.target.value;
            if (/^\d*\.?\d{0,2}$/.test(value) && parseFloat(value) >= 0) {
              setProductData({ ...productData, price: value });
            }
          }}
        />
      </div>

                  {/* Descuento */}
                  <div className="mb-3">
        <label className="text-sm text-gray-700">Descuento</label>
        <input
          type="text" // Cambiar a tipo "text" para evitar los botones
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

      {/* Stock */}
      <div className="mb-3 flex flex-col">
        <label className="text-sm text-gray-700">Opciones</label>
        <label className="flex items-center text-sm text-gray-700">
          <input
            type="checkbox"
            checked={productData.stock}
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
          onChange={(e) =>
            setProductData({ ...productData, longDescription: e.target.value })
          }
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
          type="file"
          accept="image/*"
          className="border rounded w-full py-1 px-2"
          onChange={handleImageChange}
        />
        {editingProduct?.img && (
          <div className="mt-2 w-[300px] h-[300px] relative">
            <Image
              src={
                productData.img
                  ? URL.createObjectURL(productData.img)
                  : editingProduct.img
              }
              alt="Vista previa"
              width={300}
              height={300}
              className="rounded"
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
          value={productData.brand || ""}
          onChange={(e) => {
            const value = e.target.value;
            if (value.length <= 30) { // Limita a 30 caracteres
              setProductData({ ...productData, brand: value || "" });
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
          value={productData.category}
          onChange={(e) => {
            const category = e.target.value;
            setProductData({
              ...productData,
              category,
              subcategories: [],
            });
          }}
        >
          <option value="">Selecciona una categoría</option>
          {categories.map((category) => (
            <option key={category.id} value={category.slug}>
              {capitalizeFirstLetter(category.title)}
            </option>
          ))}
        </select>
      </div>

      {/* Subcategorías */}
      {productData.category && (
        <div className="mb-3">
          <label className="text-sm text-gray-700">Subcategoría</label>
          <div className="flex items-center">
            <select
              className="border rounded w-full py-1 px-2"
              value={selectedSubcategory}
              onChange={(e) => setSelectedSubcategory(e.target.value)}
            >
              <option value="">Selecciona una subcategoría</option>
              {getSubcategories(productData.category).map((subcategory) => (
                <option key={subcategory.id} value={subcategory.slug}>
                  {capitalizeFirstLetter(subcategory.title)}
                </option>
              ))}
            </select>
            <button
              type="button"
              className="ml-2 p-2 bg-red-500 text-white rounded hover:bg-red-600"
              onClick={handleSubcategoryAdd}
            >
              <PlusIcon className="w-5 h-5" />
            </button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
      {productData.subcategory?.map((subcategorySlug) => {
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
    label="Actualizar product"
    loadingText="actualizando producto..."
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

export default EditProductForm;

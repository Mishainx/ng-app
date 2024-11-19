import { useState } from "react";
import { useProducts } from "@/context/ProductsContext";
import { useCategories } from "@/context/CategoriesContext";
import { capitalizeFirstLetter } from "@/utils/stringsManager";
import TrashIcon from "@/icons/TrashIcon";
import PlusIcon from "@/icons/PlusIcon";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Image from "next/image";

const EditProductForm = ({ editingProduct, setView }) => {
  const { updateProduct } = useProducts();
  const { categories } = useCategories();
  const [productData, setProductData] = useState({
    ...editingProduct, // Inicializa los valores con el producto recibido
    img: null, // Para manejar una nueva imagen cargada, si aplica
  });

  const [selectedSubcategory, setSelectedSubcategory] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(productData)
    try {
      await updateProduct(productData); // Asume que `updateProduct` es la función para actualizar productos
      setView(false); // Cierra el formulario
      toast.success("Producto actualizado exitosamente");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getSubcategories = (categorySlug) => {
    const selectedCategory = categories.find((cat) => cat.slug === categorySlug);
    return selectedCategory && selectedCategory.subcategories
      ? selectedCategory.subcategories
      : [];
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
    if (selectedSubcategory && !productData.subcategories.includes(selectedSubcategory)) {
      setProductData((prevData) => ({
        ...prevData,
        subcategories: [...prevData.subcategories, selectedSubcategory],
      }));
      setSelectedSubcategory("");
    }
  };

  const handleSubcategoryRemove = (subcategory) => {
    setProductData((prevData) => ({
      ...prevData,
      subcategories: prevData.subcategories.filter((sub) => sub !== subcategory),
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
          {productData?.subcategories?.length > 0 && (
            <ul className="mt-2">
              {productData.subcategories.map((subcategory) => (
                <li
                  key={subcategory}
                  className="flex justify-between items-center mb-1 p-2 border-b"
                >
                  <span>{capitalizeFirstLetter(subcategory)}</span>
                  <button
                    type="button"
                    className="text-red-500 hover:text-red-600"
                    onClick={() => handleSubcategoryRemove(subcategory)}
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <button
        type="submit"
        className="mt-4 bg-red-500 text-white px-6 py-2 rounded hover:bg-red-700"
      >
        Actualizar Producto
      </button>
    </form>
  );
};

export default EditProductForm;

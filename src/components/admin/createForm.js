import { useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import "react-toastify/dist/ReactToastify.css";

const CreateProductForm = ({setView}) => {
  const router = useRouter();
  const [errors, setErrors] = useState({});
  const [productData, setProductData] = useState({
    name: "",
    category: "",
    price: "",
    thumbnail: null,
    description: "",
    featured: false,
    visible: false,
    stock: false,
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProductData({
      ...productData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleFileChange = (e) => {
    setProductData({
      ...productData,
      thumbnail: e.target.files[0],
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Primero, valida los datos del producto
    const validationErrors = validateProduct(productData);

    // Crea un mapa de errores para mostrar en el formulario
    const errorMap = validationErrors.reduce((acc, { field, message }) => {
      acc[field] = message;
      return acc;
    }, {});

    // Si hay errores de validación, establece los errores en el estado y evita el envío del formulario
    if (Object.keys(errorMap).length > 0) {
      setErrors(errorMap);
      return;
    }

    const formData = new FormData();
    formData.append("name", productData.name);
    formData.append("category", productData.category);
    formData.append("price", productData.price);
    formData.append("description", productData.description);
    formData.append("featured", productData.featured);
    formData.append("visible", productData.visible);
    formData.append("stock", productData.stock);
    if (productData.thumbnail) {
      formData.append("thumbnail", productData.thumbnail);
    }

    try {
      const response = await fetch("/api/products", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      if (response.ok) {
        toast.success("Producto creado exitosamente");
        setProductData({
          name: "",
          category: "",
          price: "",
          thumbnail: null,
          description: "",
          featured: false,
          visible: false,
          stock: false,
        });
        await fetchProducts()
        setTimeout(() => {
          setView("list")
        }, 2000);
      } else {
        toast.error(result.message || "Error al crear el producto");
      }
    } catch (error) {
      console.error("Error al crear el producto:", error);
      toast.error("Error al crear el producto");
    }
  };

  return (
    <form
      onSubmit={handleFormSubmit}
      className="bg-white shadow-lg rounded-lg p-8 space-y-6 max-w-2xl mx-auto text-black"
    >
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
        Agregar Producto
      </h2>
      <div className="space-y-4">
        <div>
          <input
            type="text"
            name="name"
            placeholder="Nombre del producto"
            value={productData.name}
            onChange={handleInputChange}
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-2">{errors.name}</p>
          )}
        </div>

        <div>
          <select
            name="category"
            value={productData.category}
            onChange={handleInputChange}
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="" disabled>
              Selecciona una categoría
            </option>
            {
            Array.isArray(categories) && categories.length > 0 ? (
              categories.map((category) => (
                <option key={category.sku} value={category.sku}>
                  {category.sku} - {category.title}
                </option>
              ))
            ) : (
              <option disabled>
                {console.log(categories)}
                No hay categorías disponibles
              </option>
            )}
          </select>
          {errors.category && (
            <p className="text-red-500 text-sm mt-2">{errors.category}</p>
          )}
        </div>

        <div>
          <input
            type="number"
            name="price"
            placeholder="Precio"
            value={productData.price}
            onChange={handleInputChange}
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.price && (
            <p className="text-red-500 text-sm mt-2">{errors.price}</p>
          )}
        </div>

        <div>
          <input
            type="file"
            name="thumbnail"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.thumbnail && (
            <p className="text-red-500 text-sm mt-2">{errors.thumbnail}</p>
          )}
        </div>

        <div>
          <textarea
            name="description"
            placeholder="Descripción del producto"
            value={productData.description}
            onChange={handleInputChange}
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
          ></textarea>
          {errors.description && (
            <p className="text-red-500 text-sm mt-2">{errors.description}</p>
          )}
        </div>

        <div className="flex items-center space-x-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="stock"
              checked={productData.stock}
              onChange={handleInputChange}
              className="form-checkbox h-5 w-5 text-blue-600"
            />
            <span className="text-gray-700">Disponible en Stock</span>
          </label>
          {errors.stock && (
            <p className="text-red-500 text-sm mt-2">{errors.stock}</p>
          )}
        </div>

        <div className="flex items-center space-x-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="featured"
              checked={productData.featured}
              onChange={handleInputChange}
              className="form-checkbox h-5 w-5 text-blue-600"
            />
            <span className="text-gray-700">Destacado</span>
          </label>
        </div>

        <div className="flex items-center space-x-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="visible"
              checked={productData.visible}
              onChange={handleInputChange}
              className="form-checkbox h-5 w-5 text-blue-600"
            />
            <span className="text-gray-700">Visible</span>
          </label>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-300"
        >
          Agregar Producto
        </button>
      </div>
    </form>
  );
};

export default CreateProductForm;

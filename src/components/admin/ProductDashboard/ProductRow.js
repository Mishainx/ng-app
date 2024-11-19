// components/ProductRow.js
import { useProducts } from "@/context/ProductsContext";

const ProductRow = ({ product, setEditingProduct }) => {
  const { deleteProduct } = useProducts();

  return (
    <tr className="border-t">
      <td className="p-2">{product.id}</td>
      <td className="p-2">{product.title}</td>
      <td className="p-2">${product.price}</td>
      <td className="p-2 flex space-x-2 justify-center">
        <button
          className="bg-yellow-500 text-white py-1 px-3 rounded hover:bg-yellow-600"
          onClick={() => setEditingProduct(product)}
        >
          Editar
        </button>
        <button
          className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600"
          onClick={() => deleteProduct(product.id)}
        >
          Eliminar
        </button>
      </td>
    </tr>
  );
};

export default ProductRow;

import EditIcon from "@/icons/EditIcon";
import TrashIcon from "@/icons/TrashIcon";

const SubcategoryRow = ({ subcategory, updateCategory }) => {
  return (
    <tr className="bg-gray-50">
      <td className="px-4 py-3 pl-8 text-gray-600">{subcategory.name}</td>
      <td className="px-4 py-3 text-gray-600">—</td>
      <td className="px-4 py-3 flex justify-center gap-4">
        <button className="text-yellow-500 hover:text-yellow-600">
          <EditIcon />
        </button>
        <button className="text-red-500 hover:text-red-600">
          <TrashIcon />
        </button>
      </td>
    </tr>
  );
};

export default SubcategoryRow;

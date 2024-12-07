import CategoryRow from "./CategoryRow";

const CategoryTable = ({ categories, updateCategory, deleteCategory }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg overflow-hidden">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Nombre</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 hidden sm:table-cell">Imagen</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 hidden sm:table-cell">Icono</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Visible</th>
            <th className="px-4 py-3 text-center text-sm font-semibold text-gray-600">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <CategoryRow
              key={category.id}
              category={category}
              updateCategory={updateCategory}
              deleteCategory={deleteCategory}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CategoryTable;

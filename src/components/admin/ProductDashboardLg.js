"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useProducts } from "@/context/ProductsContext";

const ProductDashboardLg = () => {
  const [view, setView] = useState("list");
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [editingProductId, setEditingProductId] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { products } = useProducts();


  // Filtrar los productos según la búsqueda y categoría seleccionada
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product?.title?.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Función para manejar la eliminación de un producto
  const handleDelete = (productId) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este producto?")) {
      // Aquí iría la lógica para eliminar el producto
    }
  };

  // Función para manejar la edición de un producto
  const handleEdit = (productId) => {
    setEditingProductId(productId);
    setView("edit");
  };

  return (
    <div className="p-10 bg-gray-50 min-h-screen hidden lg:block">
      <div className="bg-white shadow-md rounded-lg p-4 mb-6">
        <div className="flex gap-5 mb-4">
          <button
            onClick={() => setView("list")}
            className={`px-4 py-2 rounded-lg font-semibold ${
              view === "list" ? "bg-gray-500 text-white" : "bg-gray-300 text-gray-700"
            }`}
          >
            Listado de productos
          </button>
          <button
            onClick={() => setView("create")}
            className={`px-4 py-2 rounded-lg font-semibold ${
              view === "create" ? "bg-gray-500 text-white" : "bg-gray-300 text-gray-700"
            }`}
          >
            Agregar Producto
          </button>
        </div>

        {view === "list" && (
          <div>
            {/* Buscador y filtro de categorías */}
            <div className="flex flex-row items-center space-x-4 mb-4 text-black">
              <input
                type="text"
                placeholder="Buscar productos..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border border-gray-300 p-2 rounded-lg w-1/3 shadow-sm"
              />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="border border-gray-300 p-2 rounded-lg w-1/3 shadow-sm text-black"
              >
                <option value="all">Todas las categorías</option>
                {categories.map((category) => (
                  <option key={category.sku} value={category.sku}>
                    {`${category.sku} - ${category.title}`}
                  </option>
                ))}
              </select>
            </div>
            {/* Tabla de productos */}
            <div className="overflow-x-auto bg-white shadow-md rounded-lg">
              <table className="min-w-full divide-y divide-gray-200 text-sm md:text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Slug</th>
                    <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Miniatura</th>
                    <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                    <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Categoría</th>
                    <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Precio</th>
                    <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                    <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Featured</th>
                    <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Visible</th>
                    <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td colSpan="9" className="px-4 py-2 text-center text-sm text-gray-500">
                        Cargando productos...
                      </td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td colSpan="9" className="px-4 py-2 text-center text-sm text-red-500">
                        Error al cargar los productos.
                      </td>
                    </tr>
                  ) : filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                      <tr key={product.id}>
                        <td className="px-4 py-2 text-center text-sm font-medium text-gray-900">{product.slug}</td>
                        <td className="px-4 py-2 text-center text-sm">
                          <Image
                            src={product.img}
                            alt={product.title}
                            width={64}
                            height={64}
                            className="object-cover rounded-lg mx-auto"
                          />
                        </td>
                        <td className="px-4 py-2 text-center text-sm text-gray-500">{product.title}</td>
                        <td className="px-4 py-2 text-center text-sm text-gray-500">{product.category}</td>
                        <td className="px-4 py-2 text-center text-sm text-gray-500">$ {product.price.toLocaleString("es-ES")}</td>
                        <td className="px-4 py-2 text-center text-sm">
                          <span
                            className={`font-semibold px-2 py-1 rounded-lg ${
                              product.stock ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                            }`}
                          >
                            {product.stock ? "Disponible" : "No Disponible"}
                          </span>
                        </td>
                        <td className="px-4 py-2 text-center text-sm text-gray-500">{product.featured ? "Sí" : "No"}</td>
                        <td className="px-4 py-2 text-center text-sm text-gray-500">{product.visible ? "Sí" : "No"}</td>
                        <td className="px-4 py-2 text-center text-sm font-medium">
                          <button 
                            className="text-darkGold hover:text-indigo-900"
                            onClick={() => handleEdit(product.id)}
                          >
                            Editar
                          </button>
                          <button 
                            className="ml-4 text-red-600 hover:text-red-900"
                            onClick={() => handleDelete(product.id)}
                          >
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="9" className="px-4 py-2 text-center text-sm text-gray-500">
                        No hay productos disponibles.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDashboardLg;

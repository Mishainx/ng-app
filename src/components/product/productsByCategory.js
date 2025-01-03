"use client";

import { useState } from "react";
import ProductCard from "./productCard";

export default function ProductsByCategory({ products }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [sortOption, setSortOption] = useState("default");

    // Filtrar productos por término de búsqueda y asegurarse de que tengan imagen
    const filteredProducts = products?.filter((product) => 
        product?.name?.toLowerCase().includes(searchTerm.toLowerCase()) && product?.img
    );

    // Usar los productos filtrados o los originales si no hay filtros aplicados
    const productsToDisplay = searchTerm ? filteredProducts : products?.filter((product) => product?.img);

    // Asegurarse de que productsToDisplay sea un array vacío si no hay productos
    const safeProductsToDisplay = Array.isArray(productsToDisplay) ? productsToDisplay : [];

    // Ordenar productos según la opción seleccionada
    const sortedProducts = [...safeProductsToDisplay].sort((a, b) => {
        if (sortOption === "priceAsc") {
            return a.price - b.price; // Ordenar por precio ascendente
        } else if (sortOption === "priceDesc") {
            return b.price - a.price; // Ordenar por precio descendente
        } else if (sortOption === "alphaAsc") {
            return a.name.localeCompare(b.name); // Ordenar alfabéticamente de A a Z
        } else if (sortOption === "alphaDesc") {
            return b.name.localeCompare(a.name); // Ordenar alfabéticamente de Z a A
        }
        return 0; // Sin ordenación
    });

    return (
        <div>
            {/* Mostrar controles de búsqueda y ordenación solo si hay productos */}
            {safeProductsToDisplay.length > 0 && (
                <div className="flex flex-col md:flex-row justify-between items-center p-4 gap-4">
                    <div className="relative w-full md:w-auto md:flex-1">
                        <input 
                            type="text" 
                            placeholder="Buscar producto..." 
                            value={searchTerm} 
                            onChange={(e) => setSearchTerm(e.target.value)} 
                            className="border border-gray-300 rounded-md p-2 w-full"
                        />
                    </div>

                    <div className="flex w-full md:w-auto md:flex-1 gap-4">
                        <select 
                            value={sortOption} 
                            onChange={(e) => setSortOption(e.target.value)} 
                            className="border border-gray-300 rounded-md p-2 w-full"
                        >
                            <option value="default">Ordenar por</option>
                            <option value="priceAsc">Menor precio</option>
                            <option value="priceDesc">Mayor precio</option>
                            <option value="alphaAsc">A-Z</option>
                            <option value="alphaDesc">Z-A</option>
                        </select>
                    </div>
                </div>
            )}

            {/* Usar grid para alinear las tarjetas */}
            <div className="grid grid-cols-2 xxs:grid-cols-2 ss:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-5 lg:gap-7 xxs:p-10">
                {safeProductsToDisplay.length === 0 ? (
                    <div className="col-span-full text-center p-4 text-gray-500">
                        No hay productos para esta categoría.
                    </div>
                ) : (
                    sortedProducts.map((product) =>
                        product?.visible ? <ProductCard key={product.id} product={product} /> : null
                      )
                )}
            </div>
        </div>
    );
}

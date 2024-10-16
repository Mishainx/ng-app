"use client";

import { useState, useEffect } from "react";
import ProductCard from "@/components/product/productCard";
import Loader from "@/components/loader/Loader";

const ProductsByCategoryContainer = ({ selectedCategory, selectedSubcategory }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch data only once based on category and subcategory
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products?category=${selectedCategory}&subcategory=${selectedSubcategory}`, {
                    cache: "no-store",
                });
                const data = await response.json();
                // Filter out products without images
                const validProducts = data.payload.filter(product => product?.img);
                setProducts(validProducts); // Set products in state
                setLoading(false); // Set loading to false when data is fetched
            } catch (error) {
                console.error("Error fetching products:", error);
                setLoading(false); // Set loading to false if there is an error
            }
        };

        fetchProducts();
    }, [selectedCategory, selectedSubcategory]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader />
            </div>
        );
    }

    return (
        <div>
            {/* Usar grid para alinear las tarjetas */}
            <div className="grid grid-cols-2 xxs:grid-cols-2 ss:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-5 lg:gap-7 xxs:p-10">
                {products.length > 0 ? (
                    products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))
                ) : (
                    <div className="col-span-full text-center p-4 text-gray-500">
                        No se encontraron productos.
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductsByCategoryContainer;

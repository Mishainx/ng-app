"use client"

import { useState } from "react";
import Image from "next/image";
import ProductDetail from "./productDetail";
import WhatsappIcon from "@/icons/WhatsappIcon";
import EyeIcon from "@/icons/EyeIcon";
import PlusIcon from "@/icons/PlusIcon";

export default function ProductCard({ product }) {
    const [showDetail, setShowDetail] = useState(false);

    const handleQuickviewClick = () => {
        setShowDetail(true);
    };

    const handleCloseDetail = () => {
        setShowDetail(false);
    };

    return (
        <div className="w-full  max-w-48 bg-gradient-to-r bg-white flex flex-col justify-center items-center rounded-lg shadow-md">
            <h3 className="text-base p-2 font-bold text-center">{product.title}</h3>
            <p className="text-xxs font-normal text-center text-gray-700">{product.description}</p>


            <div className="w-full p-2">
                
                <div className="flex items-center justify-center bg-slate-100 rounded-md">
                    <Image
                        src={product.img}
                        alt={`${product.title} imagen`}
                        width={150}
                        height={150}
                        className=""
                    />
                </div>

            </div>
            <div className=" py-5 flex flex-col justify-center items-center text-black rounded-xl">
                <div className="px-1 text-center text-xs flex flex-col items-center justify-center font-bold gap-2 z-10 ">
                    <div className="flex justify-center items-center gap-2 ">
                    <p className="text-xs">{`$ ${product.price}`}</p>
                    <button className="text-xxs bg-red-500 px-2 py-1 text-white  rounded-md">Agregar Producto</button>
                    </div>

                </div>
            </div>
            {showDetail && <ProductDetail product={product} onClose={handleCloseDetail} />}
        </div>
    );
}

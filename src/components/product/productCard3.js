import { useState } from "react";
import Image from "next/image";
import ProductDetail from "./productDetail";
import WhatsappIcon from "@/icons/WhatsappIcon";
import EyeIcon from "@/icons/EyeIcon";
import PlusIcon from "@/icons/PlusIcon";

export default function ProductCard3({ product }) {
    const [showDetail, setShowDetail] = useState(false);

    const handleQuickviewClick = () => {
        setShowDetail(true);
    };

    const handleCloseDetail = () => {
        setShowDetail(false);
    };

    return (
        <div className="w-full  max-w-48 bg-gradient-to-r bg-white flex flex-col justify-center items-center rounded-lg shadow-md">
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
                    <h3 className=" text-xs border-b-2 border-red-500">{product.title}</h3>
                    <p className="text-xxs font-normal text-center text-gray-700">{product.description}</p>
                    <p>{`$ ${product.price}`}</p>
                    <div className="p-2 flex w-full items-center justify-center gap-3" >
                        <WhatsappIcon width={40} height={40} className="text-white bg-red-600/70  hover:bg-red-800 cursor-pointer rounded-full p-2"/>
                        <PlusIcon width={40} height={40} className="text-white bg-red-600/70  hover:bg-red-800 cursor-pointer rounded-full p-1"/>
                        <div className="flex flex-col items-center justify-center">
                            <EyeIcon width={40} height={40} className="text-white bg-red-600/70  hover:bg-red-800 cursor-pointer rounded-full p-1" />
                        </div>
                    </div>
                </div>
            </div>
            {showDetail && <ProductDetail product={product} onClose={handleCloseDetail} />}
        </div>
    );
}

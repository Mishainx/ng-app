// ProductCard.jsx
"use client";

import { useState } from "react";
import Image from "next/image";
import ProductDetail from "./productDetail";
import WhatsappIcon from "@/icons/WhatsappIcon";
import EyeIcon from "@/icons/EyeIcon";
import PlusIcon from "@/icons/PlusIcon";
import Link from "next/link";

export default function ProductCard({ product }) {
  const [showDetail, setShowDetail] = useState(false);

  const handleQuickviewClick = () => {
    setShowDetail(true);
  };

  const handleCloseDetail = () => {
    setShowDetail(false);
  };

  return (
    <div className="w-full bg-white flex flex-col justify-between items-center rounded-lg shadow-md overflow-hidden h-80 max-w-[200px] transition-transform duration-500 hover:shadow-lg hover:scale-105 hover:translate-y-[-4px] ">
      <Link href={`/product/${product.id}`} className="w-full">
        <div className="w-full p-2 flex justify-center bg-slate-100 rounded-md h-36">
            <Image
            src={product.img}
            alt={`${product.title} imagen`}
            width={150}
            height={150}
            className="object-contain"
            />
        </div>
      </Link>
      <div className="py-4 flex flex-col justify-between items-center text-black rounded-xl w-full px-3 h-full">
        <div className="flex flex-col justify-between items-center w-full h-full">
          <div className="flex flex-col justify-between w-full h-full">
            <h3 className="text-sm font-semibold text-gray-800 text-center">{product.title}</h3>
            <p className="text-xs font-normal text-gray-700 mt-1 line-clamp-2 text-center">{product.description}</p>
            <p className="text-sm font-semibold text-gray-800 mt-2 text-center">{`$ ${product.price}`}</p>
          </div>
          <div className="flex w-full justify-center gap-3 mt-2">
            <WhatsappIcon
              width={40}
              height={40}
              className="text-white bg-red-600/70 hover:bg-red-800 cursor-pointer rounded-full p-2"
            />
            <PlusIcon
              width={40}
              height={40}
              className="text-white bg-red-600/70 hover:bg-red-800 cursor-pointer rounded-full p-1"
            />
            <Link  href={`/product/${product.id}`}>
                <EyeIcon
                width={40}
                height={40}
                className="text-white bg-red-600/70 hover:bg-red-800 cursor-pointer rounded-full p-1"
                />
            </Link>
          </div>
        </div>
      </div>
      {showDetail && <ProductDetail product={product} onClose={handleCloseDetail} />}
    </div>
  );
}

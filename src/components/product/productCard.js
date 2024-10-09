import { capitalizeFirstLetter } from "@/utils/stringsManager";
import Image from "next/image";
import Link from "next/link";
import { formatPriceToUSD } from "@/utils/stringsManager";

export default function ProductCard({ product }) {
  console.log(product)
  return (
    <div className="w-32 h-56 shadow-md flex flex-col items-center justify-between text-center hover:scale-105 transition-transform duration-500 relative">
      {/* Condición para la banderita */}
      {product?.name?.toLowerCase().startsWith("t") && (
        <div className="absolute -top-3 right-0 bg-red-500 text-white text-xs px-2 py-1 rounded-bl-lg">
          NipponGame
        </div>
      )}
      
      {/* Imagen */}
      <div className="flex items-center justify-center my-2 w-full h-24">
        <Image
          src={product.img}
          alt={`${product.name} imagen`}
          width={120}
          height={120}
          className="object-cover"
        />
      </div>
      <h3 className="text-xs mb-1 font-semibold">{product?.name?.toUpperCase()}</h3>
      <p className="text-xs mb-1">
        {capitalizeFirstLetter(product.shortDescription)}
      </p>
      <p className="text-sm mb-1">{formatPriceToUSD(product.price)}</p>
      <Link href={`/product/${product.slug}`} className="bg-red-500 w-full text-white hover:bg-red-700 py-1">
        <p className="text-xs">Ver detalle</p>
      </Link>
    </div>
  );
}

import Image from "next/image";
import Link from "next/link";

export default function ProductCard({ product }) {
  return (
    <div className="w-32 h-56 shadow-md flex flex-col items-center justify-between text-center hover:scale-105 transition-transform duration-500">
      {/* Imagen */}
      <div className="flex items-center justify-center bg-slate-200 my-2 w-full h-24">
        <Image
          src={product.img}
          alt={`${product.title} imagen`}
          width={80}
          height={80}
          className="object-cover"
        />
      </div>
      <h3 className="text-xs mb-1 font-semibold">{product.title}</h3>
      <p className="text-xs mb-1">
        {`${product.shortDescription.charAt(0).toUpperCase()}${product.shortDescription.slice(1)}`}
      </p>
      <p className="text-sm mb-1">${product.price}</p>
      <Link href={`/product/${product.id}`} className="bg-red-500 w-full text-white hover:bg-red-700 py-1 ">
        <p className="text-xs">Ver detalle</p>
      </Link>
    </div>
  );
}

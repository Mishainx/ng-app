import { capitalizeFirstLetter } from "@/utils/stringsManager";
import Image from "next/image";
import Link from "next/link";
import ProductPrice from "./productPrice";
 // Importar el contexto

export default function ProductCard({ product, discount }) {

  return (
    <div className="w-28 xxs:w-32 h-64 shadow-md flex flex-col items-center justify-between text-center hover:scale-105 transition-transform duration-500 relative bg-white">
      {/* Banderita Condicional */}
      {product?.discount > 0 ? (
        <div className="absolute -top-3 right-0 bg-red-500 text-white text-xs px-2 py-1 rounded-bl-lg">
          OFERTA!
        </div>
      ) : product?.brand?.toLowerCase() === "nippongame" ? (
        <div className="absolute -top-3 right-0 bg-red-500 text-white text-xs px-2 py-1 rounded-bl-lg">
          NipponGame
        </div>
      ) : null}

      {/* Imagen */}
      <div className="h-32 flex items-center justify-center w-full p-1">
        {product.img ? (
          <Image
            src={product.img}
            alt={`${product.name} imagen`}
            width={120}
            height={120}
            className="object-cover"
          />
        ) : (
          <div className="h-28 w-28 bg-gray-300 flex items-center justify-center text-gray-500">
            <p>No disponible</p>
          </div>
        )}
      </div>
      
      {/* Contenido */}
      <div className="flex-grow flex flex-col justify-around">
        <h3 className="text-xs font-semibold">
          {product?.name?.toUpperCase()}
        </h3>
        <p className="text-xs">
          {capitalizeFirstLetter(product.shortDescription)}
        </p>
        
        {/* Precio */}
        <ProductPrice price={product.price} discount={product.discount}/>
      </div>

      {/* Botón de detalle */}
      <Link href={`/product/${product.slug}`} className="bg-red-500 w-full text-white hover:bg-red-700 py-1">
        <p className="text-xs">Ver detalle</p>
      </Link>
    </div>
  );
}

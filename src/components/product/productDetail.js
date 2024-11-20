"use client";

import Image from "next/image";
import { capitalizeFirstLetter, formatPriceToUSD } from "@/utils/stringsManager";
import ActionButtons from "./actionsButtons";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import EyeIcon from "@/icons/EyeIcon";

// Imagen de fallback si la imagen del producto es null
const fallbackImage = "/images/default-product.png";

export default function ProductDetail({ product }) {
  const { userData, loading } = useAuth();

  // Arreglo de detalles del producto
  const productDetails = [
    { label: "Presentación", value: capitalizeFirstLetter(product.shortDescription) },
    { label: "Marca", value: capitalizeFirstLetter(product.brand) },
    { label: "Descripción", value: capitalizeFirstLetter(product.longDescription) },
    { label: "Categoría", value: capitalizeFirstLetter(product.category) },
    { label: "Stock", value: product.stock ? "Disponible" : "Sin stock" },
    { label: "Sku", value: product.sku },
    // Nueva clave subcategorías
    {
      label: "Subcategorías",
      value: product.subcategory
        ? product.subcategory
            .map((sub) =>
              capitalizeFirstLetter(sub.replace(`${product.category}-`, ""))
            )
            .join(", ")
        : "No disponible",
    }
  ];

  return (
    <div className="flex flex-col items-center sm:flex-row md:items-start gap-10 p-6">
      {/* Imagen del producto */}
      <div className="w-full md:w-1/2 flex justify-center">
        {product.img ? (
          <Image
            src={product.img}
            alt={product.name}
            width={400}
            height={400}
            className="object-cover shadow-lg rounded-lg"
            loading="lazy"
          />
        ) : (
          <Image
            src={fallbackImage}
            alt="Imagen no disponible"
            width={400}
            height={400}
            className="object-cover shadow-lg rounded-lg"
          />
        )}
      </div>

      {/* Detalles del producto */}
      <div className="w-full md:w-1/2">
        <h1 className="text-3xl font-bold text-gray-800 text-center md:text-left mb-2 flex items-center justify-center md:justify-start">
          {product.name.toUpperCase()}
          {product.discount > 0 && (
            <div className="bg-red-500 text-white text-sm font-semibold px-2 py-1 rounded-md ml-2">
              ¡OFERTA!
            </div>
          )}
        </h1>

        {/* Mostrar el precio y descuento solo si hay un usuario autenticado */}
        {userData ? (
          <div className="mb-4 text-center md:text-left">
            {product.discount > 0 ? (
              <>
                <p className="text-xs font-semibold text-red-500 line-through">
                  {formatPriceToUSD(product.price)}
                </p>
                <p className="text-2xl font-semibold text-red-500">
                  {formatPriceToUSD(product.price - (product.price * product.discount) / 100)}
                </p>
              </>
            ) : (
              <p className="text-2xl font-semibold text-red-500">
                {formatPriceToUSD(product.price)}
              </p>
            )}
          </div>
        ) : (
          <Link href="/login">
            <p className="my-2 flex items-center justify-center md:justify-start text-slate-400 text-xs hover:text-slate-600 transition-colors duration-300">
              <EyeIcon width="20" height="20" className="mr-1" />
              Para ver los precios debes estar registrado {/* Mostrar ícono con texto de acceso a precios */}
            </p>
          </Link>
        )}

        {/* Descripción del producto */}
        <div className="text-sm text-gray-700 space-y-2 text-start">
          {productDetails.map((detail, index) => (
            <p key={index}>
              <span className="font-semibold">{detail.label}: </span>
              {detail.value}
            </p>
          ))}
        </div>

        {/* Botones de acción */}
        <div className="mt-1 flex items-center justify-center md:justify-start">
          <ActionButtons productSku={product.sku} stock={product.stock} />
        </div>
      </div>
    </div>
  );
}

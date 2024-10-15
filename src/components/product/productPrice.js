"use client";
import EyeIcon from "@/icons/EyeIcon";
import { useAuth } from "@/context/AuthContext";
import { formatPriceToUSD } from "@/utils/stringsManager";
import Link from "next/link";

export default function ProductPrice({ price, discount }) {
  const { userData, loading } = useAuth(); // Accede al estado de autenticación

  if (loading) {
    return <p>Cargando precios...</p>; // O algún indicador de carga
  }

  return (
    <div>
      {userData ? ( // Verificar si el usuario está presente
        <>
          {discount > 0 ? (
            <>
              <p className="text-sm mb-1 line-through text-gray-500">
                {formatPriceToUSD(price)}
              </p>
              <p className="text-red-500 text-sm mb-1">
                {formatPriceToUSD(discount)}
              </p>
            </>
          ) : (
            <p className="text-sm mb-1">{formatPriceToUSD(price)}</p>
          )}
        </>
      ) : (
        <Link href="/login">
          <p className="flex items-center justify-center text-slate-400 text-xs hover:text-slate-600 transition-colors duration-300">
            <EyeIcon width="20" height="20" className="mr-1" />
            Precios
          </p>
        </Link>
      )}
    </div>
  );
}

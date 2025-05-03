"use client";
import EyeIcon from "@/icons/EyeIcon";
import { useAuth } from "@/context/AuthContext";
import { formatPriceToUSD } from "@/utils/stringsManager";
import Link from "next/link";
import SpinnerIcon from "@/icons/SpinnerIcon";
import { useEffect, useState } from "react";

export default function ProductPrice({ price, discount }) {
  const { userData, loading: authLoading } = useAuth();
  const [hasQrAccess, setHasQrAccess] = useState(false);
  const [loadingCookie, setLoadingCookie] = useState(true);

  useEffect(() => {
    const checkQrCookie = () => {
      setLoadingCookie(true);
      const hasCookie = document.cookie.includes('qrAccessCode=');
      setHasQrAccess(hasCookie);
      setLoadingCookie(false);
    };

    checkQrCookie();
  }, []);

  // Mostrar un mensaje de carga mientras el estado de autenticación o la cookie se resuelven
  if (authLoading || loadingCookie) {
    return (
      <div className="flex items-center justify-center">
        <SpinnerIcon className="text-center w-3 h-3" />
      </div>
    );
  }

  const canViewPrice = userData || hasQrAccess;

  return (
    <div>
      {canViewPrice ? ( // Si el usuario está autenticado O tiene la cookie, mostrar los precios
        <>
          {discount > 0 ? (
            <>
              <p className="text-sm mb-1 line-through text-gray-500">
                {formatPriceToUSD(price)} {/* Precio original tachado */}
              </p>
              <p className="text-red-500 text-sm mb-1">
                {formatPriceToUSD(discount)} {/* Precio con descuento */}
              </p>
            </>
          ) : (
            <p className="text-sm mb-1">{formatPriceToUSD(price)}</p> // Precio sin descuento
          )}
        </>
      ) : (
        <Link href="/login">
          <p className="flex items-center justify-center text-slate-400 text-xs hover:text-slate-600 transition-colors duration-300">
            <EyeIcon width="20" height="20" className="mr-1" />
            Ver Precios {/* Mostrar ícono con texto de acceso a precios */}
          </p>
        </Link>
      )}
    </div>
  );
}
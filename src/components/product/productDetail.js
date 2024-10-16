import Image from 'next/image';
import { capitalizeFirstLetter, formatPriceToUSD } from '@/utils/stringsManager';
import ActionButtons from './actionsButtons';

// Imagen de fallback si la imagen del producto es null
const fallbackImage = '/images/default-product.png';

export default function ProductDetail({ product }) {
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
      <div className="w-full md:w-1/2 ">
        <h1 className="text-3xl font-bold text-gray-800 text-center md:text-left mb-2 flex items-center justify-center md:justify-start">
          {product.name.toUpperCase()}
          {product.discount > 0 && (
            <div className="bg-red-500 text-white text-sm font-semibold px-2 py-1 rounded-md ml-2">
              ¡OFERTA!
            </div>
          )}
        </h1>

        {/* Mostrar el precio con descuento si existe */}
        <div className="mb-4 text-center md:text-left">
          {product.discount > 0 ? (
            <>
              <p className="text-xs font-semibold text-red-500 line-through">
                {formatPriceToUSD(product.price)}
              </p>
              <p className="text-2xl font-semibold text-red-500">
                {formatPriceToUSD(product.price - (product.price * product.discount / 100))}
              </p>
            </>
          ) : (
            <p className="text-2xl font-semibold text-red-500">
              {formatPriceToUSD(product.price)}
            </p>
          )}
        </div>
        {/* Descripcion producto */}

        <div className="text-sm text-gray-700 space-y-2 text-start">
          <p>
            <span className="font-medium">Presentación: </span>
            {capitalizeFirstLetter(product.shortDescription)}
          </p>
          <p>
            <span className="font-medium">Descripción: </span>
            {capitalizeFirstLetter(product.longDescription)}
          </p>
          <p>
            <span className="font-medium">Categoría: </span>
            {capitalizeFirstLetter(product.category)}
          </p>
          <p>
            <span className="font-medium">Stock: </span>
            {product.stock ? 'Disponible' : 'Sin stock'}
          </p>
          <p>
            <span className="font-medium">Sku: </span>
            {product.sku}
          </p>
        </div>

        {/* Botones de acción */}
        <div className="mt-1 flex items-center justify-center">
          <ActionButtons productSku={product.sku} stock={product.stock} />
        </div>
      </div>
    </div>
  );
}

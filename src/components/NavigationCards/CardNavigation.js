import Link from "next/link";
import Image from "next/image";

export default function CardNavigation({
  title,
  href,
  imgSrc,
  imgHoverSrc,
  content,
  fullPage = false,
}) {
  const hasHoverImage = Boolean(imgHoverSrc);

  return (
    <div
      className={`group relative overflow-hidden rounded-lg bg-card shadow-xl w-full`}
    >
      <Link
        href={href || "#"}
        className={`block relative w-full h-full ${fullPage ? "aspect-[16/10] sm:aspect-[3/1]" : "aspect-[16/10]"}`}
      >
        {/* Wrapper de imágenes */}
        <div
          className={`relative w-full h-full`}
        >
          {/* Imagen base */}
          <div
            className={`absolute inset-0 transition-transform duration-500 ease-in-out ${
              !fullPage && !hasHoverImage ? "group-hover:scale-105" : ""
            }`} // Solo scale si NO es fullPage
          >
            <Image
              src={imgSrc}
              alt={title}
              layout="fill"
              objectFit="cover"
              className={`transition-opacity duration-1000 ease-in-out ${
                hasHoverImage ? "opacity-100 group-hover:opacity-0" : ""
              }`}
            />
          </div>

          {/* Imagen hover */}
          {hasHoverImage && (
            <div className="absolute inset-0">
              <Image
                src={imgHoverSrc}
                alt={`${title} hover`}
                layout="fill"
                objectFit="cover"
                className="opacity-0 group-hover:opacity-100 transition-opacity duration-1000 ease-in-out"
              />
            </div>
          )}
        </div>

        {/* Overlay de contenido */}
        <div className="absolute inset-0 flex flex-col items-start justify-end px-4 py-3 z-30 bg-gradient-to-t from-black/70 via-black/30 to-transparent">
          <h3 className="text-xl font-bold text-white relative mb-1">
            {title}
            <span className="absolute -bottom-1 left-0 w-full h-1 bg-red-500 origin-left transition-transform duration-500 scale-x-100 md:scale-x-0 group-hover:md:scale-x-100"></span>
          </h3>
          <span className="text-white text-sm opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-500">
            {content}
          </span>
        </div>
      </Link>
    </div>
  );
}

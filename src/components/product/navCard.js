import Image from 'next/image';
import Link from 'next/link';

export default async function NavCard({ imgSrc, title, href }) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`,{cache:"no-store",next:{revalidate:3600}}); // Ajusta la URL según sea necesario
  const data = await response.json()
  const products = data.payload
  console.log(products)


  return (
    <div className="group relative w-11/12 sm:w-full max-w-sm overflow-hidden rounded-lg bg-card shadow-xl transition-transform duration-300 hover:scale-105 xs:w-10/12">
      <Link href={href || '#'}>
        <div className="absolute inset-0 bg-gradient-to-r from-black via-80% via-slate-900 to-slate-700 z-10"></div>
        <Image
          src={imgSrc}
          alt={title}
          width={400}
          height={250}
          quality={100} // Mejora la calidad de la imagen
          className="w-full h-full object-cover relative z-20"
        />
        <div className="absolute inset-0 flex flex-col items-start justify-end px-4 py-3 z-30">
          <div className="flex flex-col items-start justify-between">
            <h3 className="text-2xl font-bold text-white relative mb-1">
              {title}
              {/* Underline visible en móviles y con efecto de hover en dispositivos medianos y grandes */}
              <span className="absolute -bottom-1 left-0 w-full h-1 bg-red-500 origin-left transition-transform duration-500 transform scale-x-100 md:group-hover:scale-x-100 md:scale-x-0"></span>
            </h3>
            <div className="flex items-center gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <span className="text-white">+info</span>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-1 bg-red-500 origin-bottom scale-y-0 group-hover:scale-y-100 transition-transform duration-500"></div>
      </Link>
    </div>
  );
}

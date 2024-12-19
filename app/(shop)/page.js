
import CategoriesList from "../../src/components/home/categoriesList/categoriesList";
import HeroCarousel from "../../src/components/home/hero/hero";
import FeaturedProducts from "../../src/components/product/FeaturedProducts";
import NavCard from "../../src/components/product/navCard";

export const metadata = {
  title: "Nippon Game - Videojuegos",
  description: "Ecommerce mayorista de videojuegos",
  openGraph: {
    title: 'Nippongame - Ecommerce mayorista experto en videojuegos',
    description: 'Ecommerce mayorista experto en videojuegos',
    url: 'https://www.nippongame.com.ar',
    images: [
      {
        url: 'https://www.nippongame.com.ar/proximamente/nippon-game-logo.png',  // Ruta de la imagen
        width: 1200,  // Ancho de la imagen
        height: 630,  // Alto de la imagen
        alt: 'Nippongame logo',  // Descripción alternativa de la imagen
      },
    ],
  }
};


export default function Home() {

  return (
    <>
    <HeroCarousel/>

    <main className="">
      <CategoriesList/>
      <div className="w-full flex flex-row flex-wrap items-center justify-center gap-5 ">
        <NavCard imgSrc='/navCard/catalogo-nav-card.png' title='Catálogo' href='/catalogo'/>
        <NavCard imgSrc='/navCard/local-nav-card.png' title='Local' href='/local'/>
        <NavCard imgSrc='/navCard/catalogo-nav-card.png' title='Ofertas' href='/ofertas'/>
      </div>
   <FeaturedProducts/>
    </main>
    </>

  );
}


import FilterContainer from "../../src/components/filter/FilterContainer";
import CategoriesList from "../../src/components/home/categoriesList/categoriesList";
import HeroCarousel from "../../src/components/home/hero/hero";
import FeaturedProducts from "../../src/components/product/FeaturedProducts";
import NavCard from "../../src/components/product/navCard";


export default function Home() {

  return (
    <>
    <HeroCarousel/>

    <main className="">
      <CategoriesList/>
      <div className="w-full flex flex-row flex-wrap items-center justify-center gap-5 ">
        <NavCard imgSrc='/navCard/catalogo-nav-card.png' title='Catálogo' href='/catalogo'/>
        <NavCard imgSrc='/navCard/local-nav-card.png' title='Local' href='/local'/>
        <NavCard imgSrc='/navCard/catalogo-nav-card.png' title='Catálogo' href='/catalogo'/>
      </div>
      <FeaturedProducts/>
    </main>
    </>

  );
}

import CustomHero from "@/components/catalogue/CustomHero";
import ProductList from "@/components/product/productList";

export default async function Catalogo() {

  return (
          <main className="w-full flex flex-col items-center justify-start min-h-screen ">
            <CustomHero title={"Catálogo"} description={"Todos lo productos para tu tienda de videojuegos"} img={"/catalogue/catalogue-img-nippongame.png"}/>
      {/* Título de la página */}
      <ProductList />
    </main>


  );
}

import ProductList from "../product/productList";
import ProductFilter from "./productFilter";

const FilterContainer = () => {
    return(
    <section className="w-full h-full p-10 flex flex-col items-start justify-center sm:flex-row ">
        <ProductFilter/>
        <ProductList/>
    </section>

    )
};

export default FilterContainer;

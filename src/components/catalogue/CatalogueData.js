import CatalogueContainer from "@/components/catalogue/CatalogueContainer";

export default async function CatalogueData() {
  
  return (
<>

      {/* Pasar productos y categorías al componente */}
      <CatalogueContainer products={products} categories={categories} />
</>
  );
}

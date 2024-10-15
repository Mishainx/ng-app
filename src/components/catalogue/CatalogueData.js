import CatalogueContainer from "@/components/catalogue/CatalogueContainer";

export default async function CatalogueData() {

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`); // Ajusta la URL según sea necesario
    const data = await response.json()
    const products = data.payload
  
  return (
<>

hola
</>
  );
}

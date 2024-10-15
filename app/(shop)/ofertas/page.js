
export default async function Ofertas() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`,{cache:"no-store",next:{revalidate:3600}}); // Ajusta la URL según sea necesario
  const data = await response.json()
  const products = data.payload
  console.log(products[0])

    return (
      <main>
          <div className="h-screen">
          Ofertas destacadas
          </div>
      </main>
    );
  }
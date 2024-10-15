
export default async function Pedidos() {

  async function getProducts() {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories`); // Ajusta la URL según sea necesario
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
  
      const data = await response.json();
      console.log(data.payload[0])
  
      const products = data.payload;
      return products;
    } catch (error) {
      console.log("el error es aqui")
      console.error("Error fetching categories:1", error);
      return null; // O ajusta esto según cómo quieras manejar el error en tu aplicación
    }
  }
  const products = await getProducts()
  console.log(products[0])

    return (
      <main>
          <div className="h-screen">
          Pedidos
          </div>
      </main>
    );
  }
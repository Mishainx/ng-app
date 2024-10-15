
export default async function Pedidos() {

  async function getProducts() {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`); // Ajusta la URL según sea necesario
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
  
      const data = await response.json();
  
      const products = data.payload;
      return products;
    } catch (error) {

      console.error("Error fetching products:", error);
      return null; // O ajusta esto según cómo quieras manejar el error en tu aplicación
    }
  }
  const products = await getProducts()

    return (
      <main>
          <div className="h-screen">
          Pedidos
          </div>
      </main>
    );
  }
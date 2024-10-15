
export default async function Pedidos() {
  async function getCategories() {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`); // Ajusta la URL según sea necesario
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
  
      const data = await response.json();
      console.log(data.payload[0])
  
      const categories = data.payload;
      return categories;
    } catch (error) {
      console.log("el error es aqui")
      console.error("Error fetching categories:", error);
      return null; // O ajusta esto según cómo quieras manejar el error en tu aplicación
    }
  }

  await getCategories()

    return (
      <main>
          <div className="h-screen">
          Pedidos
          </div>
      </main>
    );
  }
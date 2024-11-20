export default async function Prueba() {
  let products = [];
  let total = 0;

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`); // Ajusta la URL según sea necesario
    
    if (!response.ok) {
      throw new Error(`Error fetching products: ${response.statusText}`);
    }

    const data = await response.json();
    products = data.payload;
    total = data.total;
  } catch (error) {
    console.error('Error fetching products:', error);
    // Puedes agregar un manejo de error más específico si lo deseas, como un mensaje de fallback
  }
  return (
    <div className="w-full flex flex-wrap justify-center">
      <p>{data.total}</p>
      <p>{data.payload.length}</p>

    </div>
  );
}

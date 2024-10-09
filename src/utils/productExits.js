// Función para verificar si una categoría existe
export const productExists = async (productSlug) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/${productSlug}`);
      // Verificar si la respuesta es exitosa (código 200)
      if (response.ok) {
        const data = await response.json();
        // Puedes verificar si data contiene los campos esperados
        return data ? true : false; // Retorna true si la categoría existe
      } else {
        // La categoría no existe si la respuesta no es 200
        return false;
      }
    } catch (error) {
      console.error("Error al verificar la categoría:", error);
      return false; // Retorna false en caso de error
    }
  };
// utils/subcategoryExists.js

export const subcategoryExists = async (categorySlug) => {
    try {
      // Realiza la solicitud a la API para obtener las categorías
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories`);
      // Verifica que la respuesta sea exitosa
      if (!response.ok) {
        throw new Error('Error al obtener categorías');
      }
  
      // Convierte la respuesta en JSON
      const data = await response.json();
  
      // Revisa si alguna categoría contiene la subcategoría con el slug proporcionado
      const exists = data.payload.some(category => 
        category.subcategories && category.subcategories.some(subcategory => subcategory.slug === categorySlug)
      );

      return exists; // Devuelve true si se encuentra la subcategoría, false si no
    } catch (error) {
      console.error('Error en subcategoryExists:', error);
      return false; // Retorna false en caso de error
    }
  };
  
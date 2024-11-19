export const capitalizeFirstLetter = (str) => {
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };
  
  export const formatPriceToUSD = (price) => {
    if (isNaN(price) || price === null || price === undefined) {
      return 'USD$ 0.00';
    }
  
    // Formatear el precio a dólares
    const formattedPrice = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);
    
    // Reemplazar el símbolo de dólar por 'USD$' y agregar un espacio
    return formattedPrice.replace('$', 'USD$ ') ;
  };
  
  export const formatWhatsAppNumber = (number) => {
    // Eliminar cualquier carácter que no sea numérico
    let cleanedNumber = number?.replace(/\D/g, '');
  
    // Si el número empieza con "0", quitarlo (para normalizar números locales)
    if (cleanedNumber?.startsWith('0')) {
      cleanedNumber = cleanedNumber?.slice(1);
    }
  
    // Validar longitud del número después de limpieza
    // Debe tener entre 10 y 11 dígitos para Argentina (prefijo + número)
    if (cleanedNumber?.length < 10 || cleanedNumber?.length > 11) {
      console.warn("Número de teléfono inválido:", number);
      return null; // O manejar el error como prefieras
    }
  
    // Asegurar que el número tenga el formato adecuado con el prefijo de país
    if (cleanedNumber?.length === 10) {
      return `549${cleanedNumber}`; // Número sin prefijo inicial, asume que es de Argentina
    } else if (cleanedNumber?.length === 11 && cleanedNumber?.startsWith('9')) {
      // Número ya tiene el prefijo de celular "9" (interior del país)
      return `54${cleanedNumber}`;
    } else {
      console.warn("Formato de número inesperado:", cleanedNumber);
      return null; // O manejar el error de otra forma
    }
  };
  
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
  
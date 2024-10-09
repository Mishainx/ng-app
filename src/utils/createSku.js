import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/firebase/config';

export async function generateSequentialSku(type) {
  const counterRef = doc(db, 'counters', type); // Referencia al documento del contador
  
  // Obtener el documento del contador
  const counterDoc = await getDoc(counterRef);
  
  if (!counterDoc.exists()) {
    // Si el documento no existe, crearlo con el valor inicial de 1
    await updateDoc(counterRef, { count: 1 });
    return formatSku(type, 1);
  }
  
  // Obtener el valor actual del contador
  const currentCount = counterDoc.data().count;
  
  // Incrementar el contador
  const newCount = currentCount + 1;
  await updateDoc(counterRef, { count: newCount });
  
  return formatSku(type, newCount);
}

// Función para formatear el SKU con 3 letras y el número con ceros a la izquierda
function formatSku(type, number) {
  const prefix = type.substring(0, 3).toUpperCase();  // Extrae las primeras 3 letras del tipo en mayúsculas
  const formattedNumber = number.toString().padStart(5, '0');  // Formatea el número con ceros a la izquierda
  
  return `${prefix}-${formattedNumber}`;  // Retorna el SKU en el formato deseado
}

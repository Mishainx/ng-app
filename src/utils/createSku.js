import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/firebase/config';

export async function generateSequentialSku(type) {
  const counterRef = doc(db, 'counters', type); // Referencia al documento del contador
  
  // Obtener el documento del contador
  const counterDoc = await getDoc(counterRef);
  
  if (!counterDoc.exists()) {
    // Si el documento no existe, crearlo con el valor inicial de 0
    await updateDoc(counterRef, { count: 1 });
    return formatSku(1);
  }
  
  // Obtener el valor actual del contador
  const currentCount = counterDoc.data().count;
  
  // Incrementar el contador
  const newCount = currentCount + 1;
  await updateDoc(counterRef, { count: newCount });
  
  return formatSku(newCount);
}

// Función para formatear el SKU con ceros a la izquierda
function formatSku(number) {
  return number.toString().padStart(5, '0'); // Ajusta el número de dígitos según sea necesario
}

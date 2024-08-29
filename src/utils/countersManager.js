import { db } from "@/firebase/config";
import { doc,getDoc,setDoc } from "firebase/firestore";

// Función para inicializar un contador si no existe
export async function initializeCounter(type) {
    const counterRef = doc(db, 'counters', type);
    const counterDoc = await getDoc(counterRef);
    
    if (!counterDoc.exists()) {
      await setDoc(counterRef, { count: 0 });
    }
  }
  
  // Función para obtener el valor actual del contador
 export async function getCounterValue(type) {
    const counterRef = doc(db, 'counters', type);
    const counterDoc = await getDoc(counterRef);
    
    if (counterDoc.exists()) {
      return counterDoc.data().count;
    }
    return null; // Retorna null si el contador no existe
  }
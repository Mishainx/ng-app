import { doc, getDocs, updateDoc, collection, setDoc } from 'firebase/firestore';
import { db } from '@/firebase/config';
import { generateSequentialSku } from '@/utils/createSku';

export async function POST(req) {
  try {
    // Reiniciar el contador
    const counterRef = doc(db, 'counters', 'products');
    await setDoc(counterRef, { count: 0 });
    console.log('Contador reiniciado a 0.');

    // Obtener todos los productos
    const productsRef = collection(db, 'products');
    const productsSnapshot = await getDocs(productsRef);

    // Actualizar cada producto con un nuevo SKU
    for (const productDoc of productsSnapshot.docs) {
      const productId = productDoc.id;

      // Generar un nuevo SKU
      const newSku = await generateSequentialSku('products');

      // Actualizar el SKU en el producto
      const productRef = doc(db, 'products', productId);
      await updateDoc(productRef, { sku: newSku });

      console.log(`Producto con ID ${productId} actualizado con nuevo SKU: ${newSku}`);
    }

    return new Response(JSON.stringify({ message: 'SKUs y contador reiniciados exitosamente.' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error al reiniciar los SKUs:', error.message);
    return new Response(
      JSON.stringify({ message: 'Error al reiniciar los SKUs.', error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

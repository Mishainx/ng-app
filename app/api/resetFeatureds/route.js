import { doc, getDocs, updateDoc, collection } from 'firebase/firestore';
import { db } from '@/firebase/config';

export async function POST(req) {
  try {
    // Obtener todos los productos
    const productsRef = collection(db, 'products');
    const productsSnapshot = await getDocs(productsRef);

    // Actualizar cada producto para establecer featured a false
    for (const productDoc of productsSnapshot.docs) {
      const productId = productDoc.id;

      // Referencia al producto
      const productRef = doc(db, 'products', productId);

      // Actualizar el campo "featured" a false
      await updateDoc(productRef, { featured: false });

      console.log(`Producto con ID ${productId} actualizado: featured = false`);
    }

    return new Response(JSON.stringify({ message: 'Todos los productos han sido actualizados con featured: false.' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error al actualizar los productos:', error.message);
    return new Response(
      JSON.stringify({ message: 'Error al actualizar los productos.', error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

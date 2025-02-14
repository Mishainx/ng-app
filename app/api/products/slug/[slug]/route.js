import { NextResponse } from 'next/server';
import { db } from '@/firebase/config';
import { collection, query, where, getDocs } from 'firebase/firestore';

export const GET = async (req, { params }) => {
  const { slug } = await params;

  try {
    // Realiza una consulta en la colección 'products' para encontrar el documento con el campo 'slug' correspondiente
    const productsRef = collection(db, 'products');
    const q = query(productsRef, where('slug', '==', slug));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      // Si existe al menos un documento con ese 'slug', tomamos el primero
      const docSnap = querySnapshot.docs[0];
      return NextResponse.json(
        { payload: docSnap.data() },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { message: 'Producto no encontrado' },
        { status: 404 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { message: 'Error al recuperar el producto', error: error.message },
      { status: 500 }
    );
  }
};

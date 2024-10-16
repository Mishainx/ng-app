import { NextResponse } from 'next/server';
import { db } from '@/firebase/config';
import { collection, query, where, getDocs } from 'firebase/firestore';

export const GET = async (req) => {

  try {
    // Crear una consulta para buscar todos los productos con 'featured' en true
    const productsRef = collection(db, 'products');
    const q = query(productsRef, where('featured', '==', true));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      // Mapeamos los datos de todos los productos destacados
      const featuredProducts = querySnapshot.docs.map(doc => doc.data());
      return NextResponse.json(
        { payload: featuredProducts }, // Devuelve todos los productos en un array
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { message: 'No se encontraron productos destacados' },
        { status: 404 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { message: 'Error al recuperar los productos destacados', error: error.message },
      { status: 500 }
    );
  }
};

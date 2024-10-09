import { NextResponse } from 'next/server';
import { db } from '@/firebase/config';
import { collection, query, where, getDocs } from 'firebase/firestore';

export const GET = async (req, { params }) => {
  const { productSlug } = params;

  try {
    // Crear una consulta para buscar el documento con el SKU especificado
    const productsRef = collection(db, 'products');
    const q = query(productsRef, where('slug', '==', productSlug));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      // Si se encuentra el producto, devolver los datos del primer documento encontrado
      const productData = querySnapshot.docs[0].data();
      return NextResponse.json(
        { payload: productData },
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

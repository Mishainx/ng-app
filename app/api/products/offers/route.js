import { NextResponse } from 'next/server';
import { db } from '@/firebase/config';
import { collection, query, where, getDocs } from 'firebase/firestore';

export const GET = async (req) => {
  try {
    // Crear una consulta para buscar todos los productos con 'discount' mayor a 0
    const productsRef = collection(db, 'products');
    const q = query(productsRef, where('discount', '>', 0)); // Cambia aquí para filtrar por discount
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      // Mapeamos los datos de todos los productos con discount mayor a 0
      const discountedProducts = querySnapshot.docs.map(doc => doc.data());
      console.log("", discountedProducts);
      return NextResponse.json(
        { payload: discountedProducts }, // Devuelve todos los productos en un array
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { message: 'No se encontraron productos con descuento' },
        { status: 404 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { message: 'Error al recuperar los productos con descuento', error: error.message },
      { status: 500 }
    );
  }
};

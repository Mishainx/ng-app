import { NextResponse } from 'next/server';
import { getDocs, collection, query, where } from 'firebase/firestore';
import { db } from '@/firebase/config';

// `GET` para obtener productos por categoría
export const GET = async (req, { params }) => {
  const { categorySlug } = params;

  try {
    // Consulta Firestore para filtrar productos por categoría
    const productsQuery = query(
      collection(db, 'products'),
      where('category', '==', categorySlug) // Asegúrate de que el campo 'category' existe en tus documentos
    );

    const productsSnapshot = await getDocs(productsQuery);
    const products = productsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    if (products.length > 0) {
      return NextResponse.json(
        { message: 'success', payload: products },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { message: 'No products found for this category.' },
        { status: 404 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { message: 'Error fetching products', error: error.message },
      { status: 500 }
    );
  }
};

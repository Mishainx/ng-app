import { NextResponse } from 'next/server';
import { getDocs, collection, query, where } from 'firebase/firestore';
import { db } from '@/firebase/config';

// `GET` para obtener productos por categoría y subcategoría
export const GET = async (req, { params }) => {
  const { categorySlug, subcategorySlug } = await params;

  try {
    // Asegúrate de que categorySlug y subcategorySlug no estén vacíos
    if (!categorySlug || !subcategorySlug) {
      return NextResponse.json(
        { message: 'Category and subcategory slugs are required.' },
        { status: 400 }
      );
    }

    console.log(`${categorySlug}-${subcategorySlug}`)

    // Consulta Firestore para filtrar productos por categoría y subcategoría
    const productsQuery = query(
      collection(db, 'products'),
      where('category', '==', categorySlug), // Filtro por categoría
      where('subcategory', 'array-contains', `${subcategorySlug}`) // Filtro por subcategoría dentro del array
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
        { message: 'No products found for this category and subcategory.' },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error('Error fetching products:', error); // Imprime el error para depuración
    return NextResponse.json(
      { message: 'Error fetching products', error: error.message },
      { status: 500 }
    );
  }
};

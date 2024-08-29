import { NextResponse } from 'next/server';
import { collection, getDocs,addDoc } from 'firebase/firestore';
import { db } from '@/firebase/config';
import { cookies } from "next/headers";

export const GET = async (req) => {
  try {
    const productsSnapshot = await getDocs(collection(db, 'products'));
    const products = productsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return NextResponse.json(
      { message: 'success', payload:products },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: 'Error fetching products', error: error.message },
      { status: 500 }
    );
  }
};

export const POST = async (req) => {
  try {
    // Obtener las cookies y el token
    const cookieStore = cookies();
    const cookie = cookieStore.get("ng-ct");
    
    if (!cookie || !cookie.value) {
      return NextResponse.json(
        { message: 'Unauthorized: No token provided' },
        { status: 401 }
      );
    }
    
    const token = cookie.value;
    // Verificar el token con Firebase Admin SDK
    let decodedToken;
    try {
      decodedToken = await authAdmin.verifyIdToken(token);
    } catch (error) {
      return NextResponse.json(
        { message: 'Unauthorized: Invalid token' },
        { status: 401 }
      );
    }

        // Obtener datos del producto del cuerpo de la solicitud
        const formData = await req.formData();
        const name = formData.get('name');
        const category = formData.get('category');
        const price = formData.get('price');
        const description = formData.get('description');
        const featured = formData.get('featured') === 'true';
        const visible = formData.get('visible') === 'true';
        const stock = formData.get('stock') === 'true';
        const file = formData.get('thumbnail');
    
        const productData = {
          name,
          category,
          price,
          description,
          featured,
          visible,
          stock,
          slug: '', // Se asignará después
          sku: '',  // Se asignará después
          img: ''   // Se asignará después
        };



    return NextResponse.json(
      { message: 'Product created successfully'},
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: 'Error creating product', error: error.message },
      { status: 500 }
    );
  }
};
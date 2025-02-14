// src/pages/api/counters.js

import { NextResponse } from 'next/server';
import { cookies } from "next/headers";
import { authAdmin } from '@/firebase/authManager';
import { initializeCounter, getCounterValue } from '@/utils/countersManager';

// `GET` para obtener los valores actuales de los contadores
export const GET = async (req) => {
  try {
    // Obtener las cookies y el token
    const cookieStore = await cookies();
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

                // Verifica si el usuario tiene privilegios de admin
                if (!decodedToken.admin) {
                  return NextResponse.json(
                    { message: 'Unauthorized: Admin privileges required' },
                    { status: 403 } // 403 Forbidden es adecuado para una solicitud que no tiene permiso
                  );
                }

    // Obtener los valores actuales de los contadores
    const categoriesCount = await getCounterValue('categories');
    const productsCount = await getCounterValue('products');

    return NextResponse.json(
      { message: 'Counters retrieved successfully', counters: { categories: categoriesCount, products: productsCount } },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: 'Error retrieving counters', error: error.message },
      { status: 500 }
    );
  }
};

// `POST` para crear los contadores si no existen
export const POST = async (req) => {
  try {
    // Obtener las cookies y el token
    const cookieStore = await cookies();
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

    // Obtener los tipos de contadores del cuerpo de la solicitud
    const { types } = await req.json();
    
    if (!Array.isArray(types) || !types.every(type => type === 'categories' || type === 'products')) {
      return NextResponse.json(
        { message: 'Invalid counter types' },
        { status: 400 }
      );
    }

    // Inicializar los contadores especificados
    for (const type of types) {
      await initializeCounter(type);
    }

    return NextResponse.json(
      { message: 'Counters created or initialized successfully' },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: 'Error creating counters', error: error.message },
      { status: 500 }
    );
  }
};

import { NextResponse } from 'next/server';
import { authAdmin } from '@/firebase/authManager';
import { cookies } from 'next/headers';

export async function GET(req) {
  try {
    // Obtener las cookies y el token
    const cookieStore = cookies();
    const cookie = cookieStore.get('ng-ct');

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
      // El token es inválido, eliminar la cookie
      const response = NextResponse.json(
        { message: 'Invalid token' },
        { status: 401 }
      );

      response.cookies.set('ng-ct', '', {
        httpOnly: true,
        path: '/',
        expires: new Date(0), // Expira en el pasado
      });

      return response;
    }

    // Devolver la información del usuario con solo email y uid
    const userInfo = {
      email: decodedToken.email,
      uid: decodedToken.uid,
    };

    return NextResponse.json(
      { message: 'Usuario logueado', user: userInfo },
      { status: 200 }
    );
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { message: 'Error processing request', error: error.message },
      { status: 500 }
    );
  }
}

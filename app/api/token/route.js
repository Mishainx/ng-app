import { NextResponse } from 'next/server';
import { authAdmin } from '@/firebase/authManager';

export async function POST(req) {
  try {
    console.log('Request received');

    // Obtener el token del cuerpo de la solicitud
    const { token } = await req.json();
    console.log('Token received:', token);

    if (!token) {
      console.log('No token provided');
      return NextResponse.json(
        { message: 'Token not provided' },
        { status: 400 }
      );
    }

    // Verificar el token con Firebase Admin SDK
    let decodedToken;
    try {
      console.log('Verifying token with Firebase Admin SDK...');
      decodedToken = await authAdmin.verifyIdToken(token);
      console.log('Token verified:', decodedToken);
    } catch (error) {
      console.error('Error verifying token:', error.message);

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

    // Devolver la información del usuario decodificado
    console.log('Token is valid, returning response...');
    return NextResponse.json(
      { message: 'Token is valid', user: decodedToken },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error processing request:', error.message);
    return NextResponse.json(
      { message: 'Error processing request', error: error.message },
      { status: 500 }
    );
  }
}

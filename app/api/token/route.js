import { NextResponse } from 'next/server';
import { authAdmin } from '../../../src/firebase/authManager';

export async function POST(req) {
  try {
    // Obtener el token del cuerpo de la solicitud
    const { token } = await req.json();

    if (!token) {
      return NextResponse.json(
        { message: 'Token not provided' },
        { status: 400 }
      );
    }

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

    // Devolver la información del usuario decodificado
    return NextResponse.json(
      { message: 'Token is valid', user: decodedToken },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: 'Error processing request', error: error.message },
      { status: 500 }
    );
  }
}

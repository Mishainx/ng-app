import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function middleware(request) {
  const { pathname } = new URL(request.url);

  // Permitir el acceso a los recursos estáticos
  if (pathname.startsWith('/_next/') || pathname.startsWith('/static/')) {
    return NextResponse.next();
  }

  const cookieStore = cookies();
  const cookie = cookieStore.get('ng-ct');

  // Redirigir si no hay cookie
  if (!cookie) {
    return NextResponse.redirect(new URL('/proximamente', request.url)); // Redirige a la página de inicio de sesión
  }

  // Verifica el token en la API
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token: cookie.value }) // Envía el token en el cuerpo de la solicitud
    });

    if (response.ok) {
      // Token es válido
      return NextResponse.next();
    } else {
      return NextResponse.redirect(new URL('/proximamente', request.url)); // Redirige a la página de inicio de sesión si el token no es válido
    }
  } catch (error) {
    console.error('Error al verificar el token:', error);
    return NextResponse.redirect(new URL('/proximamente', request.url)); // Redirige a la página de inicio de sesión en caso de error
  }
}

// Configura las rutas que requieren autenticación
export const config = {
  matcher: [
    '/((?!api/auth|public|proximamente|login|_next/static|_next/image|static|favicon.ico).*)'
  ],
};
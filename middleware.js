import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function middleware(request) {
  const { pathname } = new URL(request.url);

  // Permitir el acceso a recursos estáticos y rutas públicas
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/static/') ||
    pathname.startsWith('/api/') ||
    pathname === '/favicon.ico' ||
    pathname === '/proximamente'
  ) {
    return NextResponse.next();
  }

  const cookieStore = cookies();
  const cookie = cookieStore.get('ng-ct');

  // Redirigir si no hay cookie
  if (!cookie) {
    if (pathname === '/login') {
      return NextResponse.next(); // Permitir acceso a /login si no está autenticado
    }
    return NextResponse.redirect(new URL('/proximamente', request.url));
  }

  try {
    // Verifica el token en la API
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token: cookie.value }),
    });

    if (!response.ok) {
      if (pathname === '/login') {
        return NextResponse.next(); // Permitir acceso a /login si el token es inválido
      }
      return NextResponse.redirect(new URL('/proximamente', request.url));
    }

    // Decodifica la respuesta
    const { user } = await response.json();

    // Redirigir usuarios autenticados fuera de /login
    if (pathname === '/login' && user) {
      return NextResponse.redirect(new URL('/', request.url)); // Redirige al home si está autenticado
    }

    // Verifica si el usuario es admin para rutas protegidas
    if (pathname.startsWith('/admin') && !user.admin) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    // Permitir acceso si cumple los criterios
    return NextResponse.next();
  } catch (error) {
    console.error('Error al verificar el token:', error);
    return NextResponse.redirect(new URL('/proximamente', request.url));
  }
}

// Configura las rutas que requieren autenticación
export const config = {
  matcher: [
    '/((?!api|public|proximamente|_next/static|_next/image|static|favicon.ico).*)',
  ],
};

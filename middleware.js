import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function middleware(request) {
  const { pathname } = new URL(request.url);

  // Definir las rutas protegidas
  const protectedRoutes = ['/admin', '/order', '/perfil'];

  // Verificar si la ruta no está en las protegidas
  if (!protectedRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  const cookieStore = cookies();
  const cookie = cookieStore.get('ng-ct');

  // Si no hay cookie, redirigir a /login
  if (!cookie) {
    return NextResponse.redirect(new URL('/login', request.url));
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
      // Redirigir a /login si el token es inválido
      return NextResponse.redirect(new URL('/login', request.url));
    }

    const { user } = await response.json();

    // Verificar si el usuario tiene acceso a la ruta /admin
    if (pathname === '/admin' && !user.admin) {
      return NextResponse.redirect(new URL('/', request.url)); // Redirige al home si no es admin
    }

    // Redirigir usuarios autenticados fuera de /login
    if (pathname === '/login' && user) {
      return NextResponse.redirect(new URL('/', request.url)); // Redirige al home si está autenticado
    }

    // Permitir acceso si cumple los criterios
    return NextResponse.next();
  } catch (error) {
    console.error('Error al verificar el token:', error);
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

// Configura las rutas que requieren autenticación
export const config = {
  matcher: ['/admin', '/order', '/perfil'], // Solo aplica a estas rutas
};

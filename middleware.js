import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function middleware(request) {
  const { pathname } = new URL(request.url);
  console.log("Middleware - Ruta solicitada:", pathname);

  const protectedRoutes = ['/admin', '/order', '/perfil'];
  if (!protectedRoutes.includes(pathname)) {
    console.log("Middleware - Ruta no protegida, permitiendo acceso.");
    return NextResponse.next();
  }

  const cookieStore = await cookies();
  const cookie = cookieStore.get('ng-ct');

  console.log("Middleware - Cookie encontrada:", cookie ? "Sí" : "No");

  if (!cookie) {
    console.log("Middleware - No hay cookie, redirigiendo a /login");
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: cookie.value }),
    });

    console.log("Middleware - Estado de respuesta de la API:", response.status);

    if (!response.ok) {
      console.log("Middleware - Token inválido, redirigiendo a /login");
      return NextResponse.redirect(new URL('/login', request.url));
    }

    const { user } = await response.json();
    console.log("Middleware - Usuario autenticado:", user ? "Sí" : "No");

    if (pathname === '/admin' && !user.admin) {
      console.log("Middleware - Usuario no es admin, redirigiendo a /");
      return NextResponse.redirect(new URL('/', request.url));
    }

    if (pathname === '/login' && user) {
      console.log("Middleware - Usuario ya autenticado, redirigiendo a /");
      return NextResponse.redirect(new URL('/', request.url));
    }

    console.log("Middleware - Permitiendo acceso.");
    return NextResponse.next();
  } catch (error) {
    console.error("Middleware - Error verificando el token:", error);
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: ['/admin', '/order', '/perfil'],
};

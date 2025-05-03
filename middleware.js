import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function middleware(request) {
  const { pathname } = new URL(request.url);

  if (pathname.startsWith('/qr')) {
    const enteredCode = request.cookies.get('qrAccessCode')?.value;

    // Si el código ya está en las cookies, permitimos el acceso
    if (enteredCode) {
      return NextResponse.next();
    }

    // Si no hay código en las cookies, permitimos que la página /qr lo gestione
    return NextResponse.next();
  }

  const protectedRoutes = ['/admin', '/order', '/perfil'];
  if (!protectedRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  const cookieStore = await cookies();
  const cookie = cookieStore.get('ng-ct');


  if (!cookie) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: cookie.value }),
    });

    if (!response.ok) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    const { user } = await response.json();

    if (pathname === '/admin' && !user.admin) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    if (pathname === '/login' && user) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
  } catch (error) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: ['/admin', '/order', '/perfil', '/qr'],
};

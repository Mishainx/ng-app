import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
 
// This function can be marked `async` if using `await` inside
export function middleware(request) {
    const cookieStore = cookies()
    const cookie = cookieStore.get('ng-ct')

 if(!cookie){
    return NextResponse.redirect(new URL('/login', request.url))
 }


return NextResponse.next()
}
// See "Matching Paths" below to learn more
export const config = {
  matcher: '/admin/:path*',
}
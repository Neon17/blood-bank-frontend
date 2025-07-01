import axios from "axios";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define your protected and auth routes
const protectedRoutes = ['/dashboard', '/profile', '/admin'];
const authRoutes = ['/login', '/register'];

// Just to redirect from login/register to dashboard if logged in
async function authRedirect(request: NextRequest) {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;
    if (token!=null) {
        if (await isAuthenticated(token)) {
            return NextResponse.redirect(new URL('/dashboard', request.url));
        }
        cookieStore.delete('auth_token');
        return NextResponse.redirect(new URL('/login', request.url));
    }
    return NextResponse.next();
}

// Check authenticated token validity (is it expired?)
async function isAuthenticated(token: string | undefined) {
    // Verify token
    if (token) {
        try {
            const response = await axios.get('http://localhost:3000/backend/api/user', { headers: { Authorization: `Bearer ${token}` } });
            const data = await response.data;
            if (data.status) {
                return false;
            }
            return response.status === 200;
        }
        catch (error) {
            return false;
        }
    }
    return false;
}

async function authMiddleware(request: NextRequest) {
    const token = request.cookies.get('auth_token')?.value;

    // Protected routes
    const protectedRoutes = ['/profile', '/dashboard', '/admin'];
    const isProtectedRoute = protectedRoutes.some((route) => {
        return request.nextUrl.pathname.startsWith(route);
    })

    if (isProtectedRoute && !token) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    if (isProtectedRoute && !await isAuthenticated(token)) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
}

async function roleMiddleware(request: NextRequest) {
    const cookieStore = await cookies();
    const userRole = cookieStore.get('user-role')?.value;

    // Admin only routes
    if (request.nextUrl.pathname.startsWith('/admin') && userRole !== '/admin') {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
}

async function rateLimitMiddleware(request: NextRequest) {
  // Simple rate limiting (in production, use Redis or external service)
  const ip = request.headers.get('x-forwarded-for') || 'anonymous';
  const now = Date.now();
  
  // This is a simplified example - in production, use proper storage
  if (request.nextUrl.pathname.startsWith('/api/')) {
    // Add rate limiting headers
    const response = NextResponse.next();
    response.headers.set('X-RateLimit-Limit', '100');
    response.headers.set('X-RateLimit-Remaining', '99');
    return response;
  }

  return NextResponse.next();
}

export async function middleware(request: NextRequest){
    const pathname = request.nextUrl.pathname;
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    // Handle auth routes (login, register)
    if (authRoutes.some((route) => pathname.startsWith(route))) {
        return authRedirect(request);
    }

    // Handle protected routes (dashboard, profile, admin)
    let response = await authMiddleware(request);
    if (response.status!=200) return response;

    response = await roleMiddleware(request);
    if (response.status!=200) return response;

    response = await rateLimitMiddleware(request);
    return response;
}


// by running this, middleware runs on every route like /login, /signup, except these (performance overload)
// export const config = {
//     matcher: [
//         '/((?!_next/static|_next/image|favicon.ico).*)',
//     ]
// }

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/profile/:path*',
    '/admin/:path*',
    '/login',
    '/register'
  ]
}

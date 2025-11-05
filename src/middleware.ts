import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { cookies } from "next/headers";

const rateLimit = new Map<string, { count: number; resetTime: number }>();

// Define your protected and auth routes
const protectedRoutes = ['/dashboard', '/profile', '/admin'];
const authRoutes = ['/login', '/signup'];

// Cache for authenticated tokens (short-lived)
const authCache = new Map<string, { valid: boolean; timestamp: number }>();
const CACHE_TTL = 60000; // 1 minute

// Optimized: Check authenticated token validity
async function isAuthenticated(token: string): Promise<boolean> {
    // Check cache first
    const cached = authCache.get(token);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.valid;
    }

    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || '/backend/api';

        // Use fetch instead of axios for better performance in Edge Runtime
        const response = await fetch(`${apiUrl}/user`, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            // Add timeout
            signal: AbortSignal.timeout(5000)
        });

        if (!response.ok) {
            authCache.set(token, { valid: false, timestamp: Date.now() });
            return false;
        }

        const user = await response.json();

        // Cache successful authentication
        authCache.set(token, { valid: true, timestamp: Date.now() });

        // Store user in cookies if needed
        const cookieStore = await cookies();
        cookieStore.set('user', JSON.stringify(user));

        return true;
    } catch (error) {
        console.error('Auth check failed:', error);
        authCache.set(token, { valid: false, timestamp: Date.now() });
        return false;
    }
}

function getClientIP(request: NextRequest): string {
    // Common headers for IP detection
    const headers = [
        'x-forwarded-for',
        'x-real-ip',
        'cf-connecting-ip',
        'x-vercel-forwarded-for',
        'x-client-ip',
        'x-cluster-client-ip'
    ];

    for (const header of headers) {
        const value = request.headers.get(header);
        if (value) {
            // Take the first IP if multiple are present (common in x-forwarded-for)
            const ip = value.split(',')[0]?.trim();
            if (ip && ip !== 'unknown') {
                return ip;
            }
        }
    }

    // Fallback to a generic identifier
    return 'unknown';
}

function checkRateLimit(ip: string): boolean {
    const now = Date.now();
    const limit = rateLimit.get(ip);

    if (!limit || now > limit.resetTime) {
        rateLimit.set(ip, { count: 1, resetTime: now + 60000 }); // 1 minute
        return true;
    }

    if (limit.count >= 100) { // 100 requests per minute
        return false;
    }

    limit.count++;
    return true;
}

// Optimized: Single middleware function with early returns
export async function middleware(request: NextRequest) {
    const clientIP = getClientIP(request);

    if (!checkRateLimit(clientIP)) {
        return new Response('Too many requests', { status: 429 });
    }

    const { pathname } = request.nextUrl;
    const token = request.cookies.get('auth_token')?.value;

    // Early return for non-protected routes
    const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));
    const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

    if (!isAuthRoute && !isProtectedRoute) {
        return NextResponse.next();
    }

    // Handle auth routes (login, register)
    if (isAuthRoute) {
        if (token) {
            // Only check authentication if we have a token
            try {
                const authenticated = await isAuthenticated(token);
                if (authenticated) {
                    return NextResponse.redirect(new URL('/dashboard', request.url));
                }
                // Token is invalid, clear it
                const response = NextResponse.redirect(new URL('/login', request.url));
                response.cookies.delete('auth_token');
                return response;
            } catch (error) {
                // If auth check fails, proceed to login page
                console.error('Auth check error:', error);
            }
        }
        return NextResponse.next();
    }

    // Handle protected routes
    if (isProtectedRoute) {
        if (!token) {
            return NextResponse.redirect(new URL('/login', request.url));
        }

        try {
            const authenticated = await isAuthenticated(token);
            if (!authenticated) {
                const response = NextResponse.redirect(new URL('/login', request.url));
                response.cookies.delete('auth_token');
                response.cookies.delete('user');
                return response;
            }

            // Role-based access control only for admin routes
            if (pathname.startsWith('/admin')) {
                const cookieStore = await cookies();
                const rawUser = cookieStore.get('user')?.value;
                const user = rawUser ? JSON.parse(rawUser) : null;

                if (user?.role !== 'admin') {
                    return NextResponse.redirect(new URL('/dashboard', request.url));
                }
            }

            return NextResponse.next();
        } catch (error) {
            console.error('Protected route auth check failed:', error);
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    return NextResponse.next();
}

// Optimized matcher - only run on specific routes
export const config = {
    matcher: [
        '/dashboard/:path*',
        '/profile/:path*',
        '/admin/:path*',
        '/login',
        '/signup'
    ]
};
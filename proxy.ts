import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getRoleFromToken } from '@/lib/utils';

export function proxy(request: NextRequest) {
    const token = request.cookies.get('token')?.value;
    const { pathname } = request.nextUrl;

    // 1. Just check if token exists for dashboard
    if (pathname.startsWith('/dashboard') && !token) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    // 2. If they ARE logged in, don't let them see login again
    if (pathname.startsWith('/login') && token) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return NextResponse.next();
}

// Configure which paths trigger this middleware
export const config = {
    matcher: ['/dashboard/:path*', '/login'],
};

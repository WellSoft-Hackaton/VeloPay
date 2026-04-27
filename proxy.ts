import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from "@/auth";

export async function proxy(request: NextRequest) {
    const session = await auth()
    if (!session) {
        return NextResponse.redirect(new URL('/auth/signin', request.url));
    }
    return NextResponse.next();
}

// Only run this proxy for transaction-related pages and APIs
export const config = {
    matcher: [
        '/send',
        '/send/:path*',
        '/receive',
        '/receive/:path*',
        '/transfer',
        '/transfer/:path*',
        '/transfers',
        '/transfers/:path*',
        '/track',
        '/track/:path*',
        '/dashboard',
        '/dashboard/:path*',
        '/api/transfer/:path*',
        '/api/transfers/:path*'
    ]
}

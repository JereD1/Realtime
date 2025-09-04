import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  // Refresh session if expired
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const pathname = req.nextUrl.pathname;

  // --- Protect all /dashboard/* routes ---
  if (pathname.startsWith('/dashboard')) {
    if (!session) {
      // Not signed in → redirect to login
      return NextResponse.redirect(new URL('/login', req.url));
    }

    // Optional: check role from JWT app_metadata
    const role = session.user?.app_metadata?.role || 'user';

    if (pathname.startsWith('/admin') && role !== 'admin') {
      // 🚫 Block non-admin users
      return NextResponse.redirect(new URL('/unauthorized', req.url));
    }
  }

  return res;
}

export const config = {
  // Apply middleware only to protected routes
  matcher: ['/dashboard/:path*'],
};

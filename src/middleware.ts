import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const middleware = (req: NextRequest) => {
  const refreshToken = req.cookies.get('refreshToken');

  if (
    !refreshToken &&
    (req.url.includes('/create') || req.url.includes('/chat') || req.url.includes('/mypage'))
  ) {
    return NextResponse.redirect(new URL('/auth/signIn', req.url));
  }

  if (refreshToken && (req.url.includes('/auth/signIn') || req.url.includes('/auth/signUp'))) {
    return NextResponse.redirect(new URL('/mypage', req.url));
  }

  return NextResponse.next();
};

export const config = {
  matcher: ['/create/:path*', '/chat/:path*', '/mypage/:path*', '/auth/signIn', '/auth/signUp'],
};

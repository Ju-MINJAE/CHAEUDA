import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { sendRefreshTokenRequest } from '@/api/auth';
import { jwtDecode } from 'jwt-decode';

const PROTECTED_ROUTES = ['/create', '/chat', '/mypage'];
const AUTH_ROUTES = ['/auth/signIn', '/auth/signUp'];

export const middleware = async (req: NextRequest) => {
  const { pathname } = new URL(req.url);

  if (AUTH_ROUTES.some(route => pathname.startsWith(route))) {
    const refreshToken = req.cookies.get('refreshToken')?.value;

    if (refreshToken) {
      return NextResponse.redirect(new URL('/mypage', req.url));
    }
    return NextResponse.next();
  }

  if (!PROTECTED_ROUTES.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  const accessToken = req.cookies.get('accessToken')?.value;
  const refreshToken = req.cookies.get('refreshToken')?.value;

  if (!accessToken && !refreshToken) {
    return NextResponse.redirect(new URL('/auth/signIn', req.url));
  }

  try {
    if (accessToken) {
      const decodedToken: { exp: number } = jwtDecode(accessToken);
      const currentTime = Math.floor(Date.now() / 1000);

      if (decodedToken.exp > currentTime) {
        return NextResponse.next();
      }
    }

    if (refreshToken) {
      const refreshResponse = await sendRefreshTokenRequest(refreshToken);

      if (refreshResponse.success && refreshResponse.tokens) {
        const response = NextResponse.next();

        response.cookies.set('accessToken', refreshResponse.tokens.access, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          path: '/',
        });
        response.cookies.set('refreshToken', refreshResponse.tokens.refresh, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          path: '/',
        });

        return response;
      } else {
        console.error('Refresh token 갱신 실패:', refreshResponse.message);
        const response = NextResponse.redirect(new URL('/auth/signIn', req.url));
        response.cookies.delete('refreshToken');
        return response;
      }
    }

    return NextResponse.redirect(new URL('/auth/signIn', req.url));
  } catch (error) {
    console.error('Token verification error:', error);
    const response = NextResponse.redirect(new URL('/auth/signIn', req.url));
    response.cookies.delete('refreshToken');
    return response;
  }
};

export const config = {
  matcher: ['/create/:path*', '/chat/:path*', '/mypage/:path*', '/auth/signIn', '/auth/signUp'],
};

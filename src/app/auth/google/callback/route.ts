import { NextRequest, NextResponse } from 'next/server';
import { EncryptJWT } from 'jose';

const DEV_API_URL = process.env.NEXT_PUBLIC_FRONT_URL;
const JWT_SECRET = process.env.NEXT_PUBLIC_JWT_SECRET;

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const code = searchParams.get('code');

    if (!code) {
      return NextResponse.json({ error: 'No code provided' }, { status: 400 });
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/google/callback?code=${code}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    if (!response.ok) {
      console.error('Backend request failed with status:', response.status);
      throw new Error('Failed to send code to backend');
    }

    const data = await response.json();
    console.log(data);
    if (data.success) {
      const jwt = await new EncryptJWT({
        email: data.user.email,
        username: data.user.username,
        phone_number: data.user.phone_number,
      })
        .setProtectedHeader({ alg: 'dir', enc: 'A128CBC-HS256' })
        .setIssuedAt()
        .setExpirationTime('1h')
        .encrypt(new TextEncoder().encode(JWT_SECRET));

      const redirectUrl = data.user.is_active
        ? `${data.redirect_url}?user=${jwt}`
        : `${DEV_API_URL}/auth/signUp/social?user=${jwt}`;

      const responseObj = NextResponse.redirect(redirectUrl);

      // 쿠키에 토큰 저장
      responseObj.cookies.set('accessToken', data.tokens.access, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 30, // 30분
      });

      responseObj.cookies.set('refreshToken', data.tokens.refresh, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7일
      });

      return responseObj;
    }

    return NextResponse.json(data);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
      });
    } else {
      console.error('Unknown error:', error);
    }
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}

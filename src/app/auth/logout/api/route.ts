import { NextRequest, NextResponse } from 'next/server';
import { sendLogoutRequest } from '@/api/auth';

export async function GET(req: NextRequest) {
  const refreshToken = req.cookies.get('refreshToken');

  if (refreshToken) {
    const response = await sendLogoutRequest(refreshToken.value);

    if (response.success) {
      const res = NextResponse.json({ success: true, message: '로그아웃 성공' });
      res.cookies.delete('accessToken');
      res.cookies.delete('refreshToken');
      return res;
    } else {
      console.error('로그아웃 요청 실패', response.message);
      return NextResponse.json({ success: false, message: '로그아웃 요청 실패' }, { status: 500 });
    }
  } else {
    return NextResponse.json(
      { success: false, message: '리프레시 토큰이 없습니다.' },
      { status: 400 },
    );
  }
}

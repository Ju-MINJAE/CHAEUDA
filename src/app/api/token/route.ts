import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  const cookieStore = cookies();
  const token = cookieStore.get('accessToken');

  if (!token) {
    return NextResponse.json({ error: 'No token found' }, { status: 401 });
  }

  return NextResponse.json({ accessToken: token.value });
}

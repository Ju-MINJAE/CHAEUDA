'use server';

import { LoginResponse, LogoutResponse, RefreshResponse } from '@/types/types';
import { clearAuthCookies } from '@/utils/cookieUtils';
import { getCookie } from 'cookies-next';
import { cookies } from 'next/headers';

export const sendLoginRequest = async (email: string, password: string): Promise<LoginResponse> => {
  const cookieStore = await cookies();
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (response.status !== 200) {
      const errorData = await response.json();
      return {
        success: false,
        message: `${errorData.message}`,
      };
    }

    const data = await response.json();
    console.log(data);
    cookieStore.set({
      name: 'accessToken',
      value: data.tokens.access,
      httpOnly: true,
    });

    cookieStore.set({
      name: 'refreshToken',
      value: data.tokens.refresh,
      httpOnly: true,
    });

    return data;
  } catch (error) {
    console.error('로그인 요청 오류:', error);
    return {
      success: false,
      message: '로그인 실패했습니다. 이메일 비밀번호를 확인해주세요.',
    };
  }
};

export const sendRefreshTokenRequest = async (refresh: string): Promise<RefreshResponse> => {
  if (!refresh) {
    return {
      success: false,
      message: 'Refresh token이 없습니다.',
    };
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/users/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${refresh}`,
      },
      body: JSON.stringify({ refresh }),
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Refresh API Error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData,
      });

      return {
        success: false,
        message: `토큰 갱신 실패 (${response.status}): ${errorData.message || response.statusText}`,
      };
    }

    const data: RefreshResponse = await response.json();
    return data;
  } catch (error) {
    console.error('토큰 갱신 요청 오류:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : '토큰 갱신 요청에 실패했습니다.',
    };
  }
};

export const sendLogoutRequest = async (refresh: string): Promise<LogoutResponse> => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/users/logout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: refresh }),
    });

    if (!response.ok) {
      throw new Error('API 요청 실패');
    }

    const data: LogoutResponse = await response.json();
    return data;
  } catch (error) {
    console.error('로그아웃 요청 오류:', error);
    return {
      success: false,
      message: '로그아웃 요청에 실패했습니다.',
    };
  }
};

export const sendWithdrawRequest = async (password: string) => {
  try {
    const accessToken = getCookie('accessToken');
    if (!accessToken) {
      throw new Error('인증 토큰이 없습니다. 다시 로그인 해주세요.');
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/users/withdraw`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
      body: JSON.stringify({ password }),
    });

    if (!response.ok) {
      throw new Error('API 요청 실패');
    }
    clearAuthCookies();

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('회원 탈퇴 오류: ', error);
    return {
      success: false,
      message: '비밀번호 확인 후 재시도바랍니다.',
    };
  }
};

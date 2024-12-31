import { LoginResponse, LogoutResponse, RefreshResponse } from '@/types/types';

export const sendLoginRequest = async (email: string, password: string): Promise<LoginResponse> => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error('API 요청 실패');
    }

    const data: LoginResponse = await response.json();
    return data;
  } catch (error) {
    console.error('로그인 요청 오류:', error);
    return {
      success: false,
      message: '로그인 요청에 실패했습니다.',
    };
  }
};

export const sendRefreshTokenRequest = async (refresh: string): Promise<RefreshResponse> => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/users/refresh`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh }),
    });

    if (!response.ok) {
      throw new Error('API 요청 실패');
    }

    const data: RefreshResponse = await response.json();
    return data;
  } catch (error) {
    console.error('토큰 갱신 요청 오류:', error);
    return {
      success: false,
      message: '토큰 갱신 요청에 실패했습니다.',
    };
  }
};

export const sendLogoutRequest = async (refresh: string): Promise<LogoutResponse> => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/users/logout`, {
      method: 'POST',
      credentials: 'include',
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

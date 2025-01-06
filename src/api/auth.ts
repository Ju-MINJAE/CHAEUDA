import { LoginResponse, LogoutResponse, RefreshResponse } from '@/types/types';
import { clearAuthCookies } from '@/utils/cookieUtils';
import { getCookie } from 'cookies-next';

export const sendLoginRequest = async (email: string, password: string): Promise<LoginResponse> => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    
    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        message: `${errorData.message}`,
      };
    }

    const data: LoginResponse = await response.json();
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
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/users/refresh`, {
      method: 'POST',
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

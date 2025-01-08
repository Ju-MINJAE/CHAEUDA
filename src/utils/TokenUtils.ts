import { getCookie, setCookie } from 'cookies-next';
import { sendRefreshTokenRequest } from '@/api/auth';

type TokenRefreshResult = {
  success: boolean;
  message?: string;
};

export const refreshToken = async (): Promise<TokenRefreshResult> => {
  try {
    const refreshToken = await getCookie('refreshToken');

    if (!refreshToken) {
      return {
        success: false,
        message: '토큰이 존재하지 않습니다.',
      };
    }

    const response = await sendRefreshTokenRequest(refreshToken);

    if (response.success) {
      setCookie('accessToken', response.tokens?.access, { path: '/', maxAge: 60 * 30 });
      setCookie('refreshToken', response.tokens?.refresh, { path: '/', maxAge: 60 * 30 * 24 * 7 });
    }
    return { success: true };
  } catch (error) {
    console.error('토큰 갱신 오류:', error);
    return {
      success: false,
      message: '토큰 갱신에 실패했습니다.',
    };
  }
};


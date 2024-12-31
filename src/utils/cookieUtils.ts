import { setCookie as originalSetCookie, deleteCookie as originalDeleteCookie } from 'cookies-next';

export const setAuthCookie = (name: string, value: string, options = {}) => {
  const defaultOptions = {
    path: '/',
    maxAge: name === 'accessToken' ? 60 * 30 : 60 * 30 * 24 * 7,
  };
  originalSetCookie(name, value, { ...defaultOptions, ...options });
};

export const deleteAuthCookie = (name: string) => {
  originalDeleteCookie(name);
};

export const clearAuthCookies = () => {
  originalDeleteCookie('accessToken');
  originalDeleteCookie('refreshToken');
};

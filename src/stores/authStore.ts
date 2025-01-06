import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, SocialUser } from '@/types/types';

type AuthState = {
  user: User | null; // 일반 로그인 상태
  socialUser: SocialUser | null; // 소셜 로그인 후 일회성 저장
  isAuthenticated: boolean;
  login: (userData: User) => void;
  logout: () => void;
  socialLogin: (socialUserData: SocialUser) => void;
};

const useAuthStore = create<AuthState>()(
  persist(
    set => ({
      user: null,
      socialUser: null, // 초기값은 null
      isAuthenticated: false,
      login: userData =>
        set({
          user: userData,
          isAuthenticated: true,
        }),
      logout: () =>
        set({
          user: null,
          socialUser: null,
          isAuthenticated: false,
        }),
      socialLogin: socialUserData =>
        set({
          socialUser: socialUserData,
          isAuthenticated: true,
        }),
    }),
    {
      name: 'auth-storage',
    },
  ),
);

export default useAuthStore;

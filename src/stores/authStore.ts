import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types/types';

type AuthState = {
  user: User | null; // 일반 로그인 상태
  isAuthenticated: boolean;
  login: (userData: User) => void;
  logout: () => void;
};

const useAuthStore = create<AuthState>()(
  persist(
    set => ({
      user: null,
      isAuthenticated: false,
      login: userData =>
        set({
          user: userData,
          isAuthenticated: true,
        }),
      logout: () =>
        set({
          user: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: 'auth-storage',
    },
  ),
);

export default useAuthStore;

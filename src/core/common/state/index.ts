import { create } from 'zustand/react';
import { createJSONStorage, persist } from 'zustand/middleware';
import zustandStorage from '@/core/common/utils/zustandStorage';
import ENV from '@/core/common/constants/env';
import { IAuth } from '@/features/auth/auth.interface';

type TokenStore = {
  token: Omit<IAuth, 'user'> | null;
  setToken: (value: Omit<IAuth, 'user'>) => void;
  clearAuth: () => void;
};

const useAuthStore = create<TokenStore>()(
  persist(
    (set) => ({
      token: null,
      setToken: (value: Omit<IAuth, 'user'>) => {
        set({ token: value });
        // Sync with storage immediately for axios interceptor
        zustandStorage.setItem('auth-token', JSON.stringify(value));
      },
      clearAuth: () => {
        zustandStorage.removeItem('auth-token');
      },
    }),
    {
      name: ENV.STORAGE_KEY,
      storage: createJSONStorage(() => zustandStorage),
    },
  ),
);

export default useAuthStore;

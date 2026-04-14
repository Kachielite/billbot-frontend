import { create } from 'zustand/react';
import { createJSONStorage, persist } from 'zustand/middleware';
import zustandStorage from '@/core/common/utils/zustandStorage';
import ENV from '@/core/common/constants/env';

type TokenStore = {
  token: string | null;
  setToken: (value: string | null) => void;
  clearAuth: () => void;
};

const useAuthStore = create<TokenStore>()(
  persist(
    (set) => ({
      token: null,
      setToken: (value: string | null) => {
        set({ token: value });
        // Sync with storage immediately for axios interceptor
        zustandStorage.setItem('auth-token', JSON.stringify(value));
      },
      clearAuth: () => {
        set({ token: null });
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

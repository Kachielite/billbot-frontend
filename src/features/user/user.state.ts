import { IUser } from '@/features/user/user.interface';
import { createJSONStorage, persist } from 'zustand/middleware';
import zustandStorage from '@/core/common/utils/zustandStorage';
import { create } from 'zustand/react';

type UserStore = {
  user: IUser | null;
  setUser: (value: IUser) => void;
  clearUser: () => void;
};

const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      setUser: (value: IUser) => set({ user: value }),
      clearUser: () => set({ user: null }),
    }),
    {
      name: 'user-store',
      storage: createJSONStorage(() => zustandStorage),
    },
  ),
);

export default useUserStore;

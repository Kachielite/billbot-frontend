import { create } from 'zustand/react';
import { createJSONStorage, persist } from 'zustand/middleware';
import { Appearance } from 'react-native';
import zustandStorage from '@/core/common/utils/zustandStorage';

type ThemeMode = 'light' | 'dark' | null;

type ThemeStore = {
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
};

const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      themeMode: null,
      setThemeMode: (mode) => {
        Appearance.setColorScheme(mode ?? 'light');
        set({ themeMode: mode });
      },
    }),
    { name: 'theme-store', storage: createJSONStorage(() => zustandStorage) },
  ),
);

export default useThemeStore;

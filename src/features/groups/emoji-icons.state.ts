import { create } from 'zustand/react';
import { createJSONStorage, persist } from 'zustand/middleware';
import zustandStorage from '@/core/common/utils/zustandStorage';

const DEFAULT_ICONS = ['🏠', '👥', '✈️', '🍽️', '🏢', '🎮', '💪', '🎓', '⚽', '🎉', '☕'];

type GroupIconsStore = {
  icons: string[];
  setIcons: (icons: string[]) => void;
};

/**
 * Persists the user's group emoji icon list across app restarts.
 * Intentionally NOT cleared on logout — icon preferences are device-level,
 * not account-level. Logout only calls clearAuth / clearUser and never
 * touches this store.
 */
const useGroupIconsStore = create<GroupIconsStore>()(
  persist(
    (set) => ({
      icons: DEFAULT_ICONS,
      setIcons: (icons) => set({ icons }),
    }),
    {
      name: 'group-icons-store',
      storage: createJSONStorage(() => zustandStorage),
    },
  ),
);

export default useGroupIconsStore;

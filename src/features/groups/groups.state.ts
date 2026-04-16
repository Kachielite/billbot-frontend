import { create } from 'zustand/react';
import { Group } from './groups.interface';

type GroupsStore = {
  groups: Group[];
  setGroups: (groups: Group[]) => void;
  addGroup: (group: Group) => void;
  removeGroup: (groupId: string) => void;
  updateGroup: (group: Group) => void;
};

const useGroupsStore = create<GroupsStore>((set) => ({
  groups: [],
  setGroups: (groups) => set({ groups }),
  addGroup: (group) => set((state) => ({ groups: [...state.groups, group] })),
  removeGroup: (groupId) =>
    set((state) => ({ groups: state.groups.filter((g) => g.id !== groupId) })),
  updateGroup: (group) =>
    set((state) => ({
      groups: state.groups.map((g) => (g.id === group.id ? group : g)),
    })),
}));

export default useGroupsStore;

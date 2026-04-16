import { create } from 'zustand/react';
import { Pool } from './pools.interface';

type PoolsStore = {
  poolsByGroup: Record<string, Pool[]>;
  setGroupPools: (groupId: string, pools: Pool[]) => void;
  addPool: (groupId: string, pool: Pool) => void;
  updatePool: (groupId: string, pool: Pool) => void;
};

const usePoolsStore = create<PoolsStore>((set) => ({
  poolsByGroup: {},
  setGroupPools: (groupId, pools) =>
    set((state) => ({ poolsByGroup: { ...state.poolsByGroup, [groupId]: pools } })),
  addPool: (groupId, pool) =>
    set((state) => ({
      poolsByGroup: {
        ...state.poolsByGroup,
        [groupId]: [...(state.poolsByGroup[groupId] ?? []), pool],
      },
    })),
  updatePool: (groupId, pool) =>
    set((state) => ({
      poolsByGroup: {
        ...state.poolsByGroup,
        [groupId]: (state.poolsByGroup[groupId] ?? []).map((p) => (p.id === pool.id ? pool : p)),
      },
    })),
}));

export default usePoolsStore;

import { create } from 'zustand/react';
import { Settlement } from './settlements.interface';

type SettlementsStore = {
  pendingSettlements: Settlement[];
  setPendingSettlements: (settlements: Settlement[]) => void;
  removeSettlement: (settlementId: string) => void;
};

const useSettlementsStore = create<SettlementsStore>((set) => ({
  pendingSettlements: [],
  setPendingSettlements: (settlements) => set({ pendingSettlements: settlements }),
  removeSettlement: (settlementId) =>
    set((state) => ({
      pendingSettlements: state.pendingSettlements.filter((s) => s.id !== settlementId),
    })),
}));

export default useSettlementsStore;

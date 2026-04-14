import { create } from 'zustand/react';
import { LogExpenseSchemaType } from './expenses.dto';
import { ParsedReceipt } from './expenses.interface';

type DraftExpense = Partial<LogExpenseSchemaType> & {
  receiptUrl?: string;
  parsedReceipt?: ParsedReceipt;
};

type ExpensesStore = {
  draftExpense: DraftExpense;
  setDraftExpense: (patch: Partial<DraftExpense>) => void;
  clearDraftExpense: () => void;
};

const useExpensesStore = create<ExpensesStore>((set) => ({
  draftExpense: {},
  setDraftExpense: (patch) =>
    set((state) => ({ draftExpense: { ...state.draftExpense, ...patch } })),
  clearDraftExpense: () => set({ draftExpense: {} }),
}));

export default useExpensesStore;

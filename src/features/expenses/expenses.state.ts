import { create } from 'zustand/react';
import { LogExpenseSchemaType } from './expenses.dto';
import { Expense, ParsedReceipt } from './expenses.interface';

type DraftExpense = Partial<LogExpenseSchemaType> & {
  receiptUrl?: string;
  parsedReceipt?: ParsedReceipt;
};

type ExpensesStore = {
  draftExpense: DraftExpense;
  setDraftExpense: (patch: Partial<DraftExpense>) => void;
  clearDraftExpense: () => void;
  isParsingReceipt: boolean;
  setIsParsingReceipt: (value: boolean) => void;
  selectedExpense: Expense | null;
  setSelectedExpense: (expense: Expense | null) => void;
};

const useExpensesStore = create<ExpensesStore>((set) => ({
  draftExpense: {},
  setDraftExpense: (patch) =>
    set((state) => ({ draftExpense: { ...state.draftExpense, ...patch } })),
  clearDraftExpense: () => set({ draftExpense: {} }),
  isParsingReceipt: false,
  setIsParsingReceipt: (value: boolean) => set({ isParsingReceipt: value }),
  selectedExpense: null,
  setSelectedExpense: (expense: Expense | null) => set({ selectedExpense: expense }),
}));

export default useExpensesStore;

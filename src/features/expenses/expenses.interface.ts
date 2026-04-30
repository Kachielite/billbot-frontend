export interface Split {
  id: string;
  expenseId: string;
  owedBy: string | null;
  amount: number;
  amountSettled: number;
  amountRemaining: number;
  settled: boolean;
  settledAt: Date | null;
  name: string | null;
  avatarUrl: string | null;
}

export interface Expense {
  id: string;
  poolId: string;
  paidBy: string | null;
  amount: number;
  currency: string;
  description: string | null;
  categoryId: string | null;
  categoryEmoji: string | null;
  receiptUrl: string | null;
  createdAt: Date;
  isRecurring: boolean;
  recurrenceFrequency: string | null;
  recurrenceEndDate: Date | null;
  recurrenceParentId: string | null;
  nextOccurrenceAt: Date | null;
  splits: Split[];
}

export interface UpcomingExpense {
  id: string;
  poolId: string;
  paidBy: string;
  amount: number;
  currency: string;
  description: string | null;
  categoryId: string | null;
  categoryEmoji: string | null;
  receiptUrl: string | null;
  isRecurring: true;
  recurrenceFrequency: 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'yearly';
  recurrenceEndDate: Date | null;
  recurrenceParentId: string | null;
  nextOccurrenceAt: Date;
  createdAt: Date;
}

export interface ParsedReceipt {
  amount: number | null;
  currency: string | null;
  merchant: string | null;
  description: string | null;
  categoryId: string | null;
  date: string | null;
}

export interface ParseReceiptResult {
  parsed: ParsedReceipt | null;
  receiptUrl: string;
}

export interface Split {
  id: string;
  expenseId: string;
  owedBy: string | null;
  amount: number;
  settled: boolean;
  settledAt: Date | null;
}

export interface Expense {
  id: string;
  poolId: string;
  paidBy: string | null;
  amount: number;
  currency: string;
  description: string | null;
  categoryId: string | null;
  receiptUrl: string | null;
  createdAt: Date;
  isRecurring: boolean;
  recurrenceFrequency: string | null;
  recurrenceEndDate: Date | null;
  nextOccurrenceAt: Date | null;
  splits: Split[];
}

export interface ParsedReceipt {
  amount: number | null;
  currency: string | null;
  merchant: string | null;
  description: string | null;
  category: string | null;
  date: string | null;
}

export interface ParseReceiptResult {
  parsed: ParsedReceipt | null;
  receiptUrl: string;
}

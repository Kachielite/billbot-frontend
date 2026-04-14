import { z } from 'zod';

// ── Request schemas (Zod) ─────────────────────────────────────────────────────
export const logExpenseSchema = z
  .object({
    amount: z.number().positive('Amount must be greater than 0'),
    description: z.string().max(255).optional(),
    categoryId: z.string().uuid().optional(),
    currency: z.enum(['NGN', 'KES', 'GHS', 'ZAR']).optional(),
    isRecurring: z.boolean().optional(),
    recurrenceFrequency: z.enum(['daily', 'weekly', 'biweekly', 'monthly', 'yearly']).optional(),
    recurrenceEndDate: z.string().datetime().optional(),
  })
  .refine((data) => !data.isRecurring || data.recurrenceFrequency, {
    message: 'Recurrence frequency is required for recurring expenses',
    path: ['recurrenceFrequency'],
  });
export type LogExpenseSchemaType = z.infer<typeof logExpenseSchema>;

// ── Response DTOs ─────────────────────────────────────────────────────────────
export interface SplitDto {
  id: string;
  expense_id: string;
  owed_by: string | null;
  amount: string;
  settled: boolean;
  settled_at: string | null;
}

export interface ExpenseDto {
  id: string;
  pool_id: string;
  paid_by: string | null;
  amount: string;
  currency: string;
  description: string | null;
  category_id: string | null;
  receipt_url: string | null;
  created_at: string;
  is_recurring: boolean;
  recurrence_frequency: string | null;
  recurrence_end_date: string | null;
  next_occurrence_at: string | null;
  splits: SplitDto[];
}

export interface ParsedReceiptDto {
  amount: number | null;
  currency: string | null;
  merchant: string | null;
  description: string | null;
  category: string | null;
  date: string | null;
}

export interface ParseReceiptResponseDto {
  parsed: ParsedReceiptDto | null;
  receipt_url: string;
}

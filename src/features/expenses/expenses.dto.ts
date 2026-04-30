import { z } from 'zod';
import type { Asset } from 'react-native-image-picker';

// ── Request schemas (Zod) ─────────────────────────────────────────────────────
const splitEntrySchema = z.object({
  userId: z.string(),
  amount: z.number().positive(),
});

export type SplitEntry = z.infer<typeof splitEntrySchema>;

export const logExpenseSchema = z
  .object({
    amount: z.coerce.number<number>().positive('Amount must be greater than 0'),
    description: z.string().max(255).optional(),
    categoryId: z.string().uuid().optional(),
    currency: z.string().optional(),
    isRecurring: z.boolean(),
    recurrenceFrequency: z.enum(['daily', 'weekly', 'biweekly', 'monthly', 'yearly']).optional(),
    recurrenceEndDate: z.string().datetime().optional(),
    splits: z.array(splitEntrySchema).optional(),
    receipt: z.custom<Asset>().optional(),
  })
  .refine((data) => !data.isRecurring || data.recurrenceFrequency, {
    message: 'Recurrence frequency is required for recurring expenses',
    path: ['recurrenceFrequency'],
  })
  .superRefine((data, ctx) => {
    if (!data.splits?.length || !data.amount) return;
    const sum = data.splits.reduce((acc, s) => acc + s.amount, 0);
    if (Math.abs(sum - data.amount) > 0.01) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Split amounts (${sum.toFixed(2)}) must equal the expense total (${data.amount.toFixed(2)})`,
        path: ['splits'],
      });
    }
  });
export type LogExpenseSchemaType = z.infer<typeof logExpenseSchema>;

export interface ExpenseListParams {
  page?: number;
  limit?: number;
  status?: 'pending' | 'settled';
  from?: string;
  to?: string;
}

// ── Response DTOs ─────────────────────────────────────────────────────────────
export interface SplitDto {
  id: string;
  expense_id: string;
  owed_by: string | null;
  amount: string;
  amountSettled: string;
  amountRemaining: string;
  settled: boolean;
  settled_at: string | null;
  name: string | null;
  avatar_url: string | null;
}

export interface ExpenseDto {
  id: string;
  pool_id: string;
  paid_by: string | null;
  amount: string;
  currency: string;
  description: string | null;
  category_id: string | null;
  category_emoji: string | null;
  receipt_url: string | null;
  created_at: string;
  is_recurring: boolean;
  recurrence_frequency: string | null;
  recurrence_end_date: string | null;
  recurrence_parent_id: string | null;
  next_occurrence_at: string | null;
  splits?: SplitDto[];
}

export interface UpcomingExpenseDto {
  id: string;
  pool_id: string;
  paid_by: string;
  amount: string;
  currency: string;
  description: string | null;
  category_id: string | null;
  category_emoji: string | null;
  receipt_url: string | null;
  is_recurring: true;
  recurrence_frequency: 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'yearly';
  recurrence_end_date: string | null;
  recurrence_parent_id: string | null;
  next_occurrence_at: string;
  created_at: string;
}

export interface ParsedReceiptDto {
  amount: number | null;
  currency: string | null;
  merchant: string | null;
  description: string | null;
  category_id: string | null;
  date: string | null;
}

export interface ParseReceiptResponseDto {
  parsed: ParsedReceiptDto | null;
  receipt_url: string;
}

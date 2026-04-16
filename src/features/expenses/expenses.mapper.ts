import { ExpenseDto, ParseReceiptResponseDto, SplitDto, UpcomingExpenseDto } from './expenses.dto';
import { Expense, ParseReceiptResult, Split, UpcomingExpense } from './expenses.interface';

export const mapSplitFromDto = (dto: SplitDto): Split => ({
  id: dto.id,
  expenseId: dto.expense_id,
  owedBy: dto.owed_by,
  amount: parseFloat(dto.amount),
  settled: dto.settled,
  settledAt: dto.settled_at ? new Date(dto.settled_at) : null,
});

export const mapExpenseFromDto = (dto: ExpenseDto): Expense => ({
  id: dto.id,
  poolId: dto.pool_id,
  paidBy: dto.paid_by,
  amount: parseFloat(dto.amount),
  currency: dto.currency,
  description: dto.description,
  categoryId: dto.category_id,
  receiptUrl: dto.receipt_url,
  createdAt: new Date(dto.created_at),
  isRecurring: dto.is_recurring,
  recurrenceFrequency: dto.recurrence_frequency,
  recurrenceEndDate: dto.recurrence_end_date ? new Date(dto.recurrence_end_date) : null,
  nextOccurrenceAt: dto.next_occurrence_at ? new Date(dto.next_occurrence_at) : null,
  splits: dto.splits.map(mapSplitFromDto),
});

export const mapUpcomingExpenseFromDto = (dto: UpcomingExpenseDto): UpcomingExpense => ({
  id: dto.id,
  poolId: dto.pool_id,
  paidBy: dto.paid_by,
  amount: parseFloat(dto.amount),
  currency: dto.currency,
  description: dto.description,
  categoryId: dto.category_id,
  receiptUrl: dto.receipt_url,
  isRecurring: true,
  recurrenceFrequency: dto.recurrence_frequency,
  recurrenceEndDate: dto.recurrence_end_date ? new Date(dto.recurrence_end_date) : null,
  recurrenceParentId: dto.recurrence_parent_id,
  nextOccurrenceAt: new Date(dto.next_occurrence_at),
  createdAt: new Date(dto.created_at),
});

export const mapParsedReceiptFromDto = (dto: ParseReceiptResponseDto): ParseReceiptResult => ({
  parsed: dto.parsed
    ? {
        amount: dto.parsed.amount,
        currency: dto.parsed.currency,
        merchant: dto.parsed.merchant,
        description: dto.parsed.description,
        category: dto.parsed.category,
        date: dto.parsed.date,
      }
    : null,
  receiptUrl: dto.receipt_url,
});

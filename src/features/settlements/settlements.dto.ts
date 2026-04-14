import { z } from 'zod';

// ── Request schemas (Zod) ─────────────────────────────────────────────────────
export const submitSettlementSchema = z.object({
  toUserId: z.string().uuid('Invalid user'),
  amount: z.number().positive('Amount must be greater than 0'),
  note: z.string().max(500).optional(),
});
export type SubmitSettlementSchemaType = z.infer<typeof submitSettlementSchema>;

export const disputeSettlementSchema = z.object({
  reason: z.string().min(1, 'Please describe why you are disputing').max(500),
});
export type DisputeSettlementSchemaType = z.infer<typeof disputeSettlementSchema>;

// ── Response DTOs ─────────────────────────────────────────────────────────────
export interface SettlementDto {
  id: string;
  pool_id: string | null;
  from_user: string | null;
  to_user: string | null;
  amount: string;
  currency: string;
  proof_url: string | null;
  note: string | null;
  status: 'pending_verification' | 'settled' | 'disputed';
  disputed_reason: string | null;
  confirmed_at: string | null;
  created_at: string;
}

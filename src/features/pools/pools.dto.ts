import { z } from 'zod';

// ── Request schemas (Zod) ─────────────────────────────────────────────────────
export const createPoolSchema = z.object({
  name: z.string().min(1, 'Pool name is required').max(100),
  description: z.string().max(500).optional(),
  memberIds: z.array(z.string().uuid()).min(1, 'Select at least one member'),
});
export type CreatePoolSchemaType = z.infer<typeof createPoolSchema>;

export const updatePoolSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(500).nullable().optional(),
  status: z.enum(['active', 'settled', 'closed']).optional(),
});
export type UpdatePoolSchemaType = z.infer<typeof updatePoolSchema>;

// ── Response DTOs ─────────────────────────────────────────────────────────────
export interface PoolBalanceDto {
  total_owed: number;
  total_owed_to_me: number;
  net_balance: number;
  currency: string;
}

export interface PoolDto {
  id: string;
  group_id: string;
  name: string;
  description: string | null;
  status: 'active' | 'settled' | 'closed';
  activity_status: 'empty' | 'ongoing' | 'settled';
  expense_count: number;
  balance?: PoolBalanceDto;
  split_type: string;
  created_by: string | null;
  created_at: string;
}

export interface PaginatedPoolsDto {
  page: number;
  limit: number;
  total_items: number;
  pages: number;
  items: PoolDto[];
}

export interface PoolMemberDto {
  pool_id: string;
  user_id: string;
  joined_at: string;
}

export interface PoolDetailDto extends PoolDto {
  members: PoolMemberDto[];
}

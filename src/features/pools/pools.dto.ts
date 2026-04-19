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
export interface PoolDto {
  id: string;
  group_id: string;
  name: string;
  description: string | null;
  status: 'active' | 'settled' | 'closed';
  activity_status: 'empty' | 'ongoing' | 'settled';
  split_type: string;
  created_by: string | null;
  created_at: string;
}

export interface PoolMemberDto {
  pool_id: string;
  user_id: string;
  joined_at: string;
}

export interface PoolDetailDto extends PoolDto {
  members: PoolMemberDto[];
}

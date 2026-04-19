import { z } from 'zod';

// ── Request schemas (Zod) ─────────────────────────────────────────────────────
export const createGroupSchema = z.object({
  name: z.string().min(1, 'Group name is required').max(100),
  description: z.string().max(500).optional(),
  emoji: z.string().max(10).optional(),
  color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, 'Must be a valid hex color')
    .optional(),
});
export type CreateGroupSchemaType = z.infer<typeof createGroupSchema>;

export interface ListGroupsParamsDto {
  page?: number;
  limit?: number;
  include_members?: boolean;
}

// ── Response DTOs ─────────────────────────────────────────────────────────────
export interface GroupBalanceDto {
  total_owed: number;
  total_owed_to_me: number;
  net_balance: number;
  currency: string;
}

export interface GroupDto {
  id: string;
  name: string;
  description: string | null;
  emoji: string | null;
  color: string | null;
  invite_code: string;
  created_by: string | null;
  created_at: string;
  member_count: number;
  members?: GroupMemberDto[];
  balance?: GroupBalanceDto;
}

export interface GroupMemberDto {
  user_id: string;
  name: string;
  email: string | null;
  avatar_url: string | null;
  role: 'admin' | 'member';
  joined_at: string;
}

export interface GroupDetailDto extends GroupDto {
  members: GroupMemberDto[];
}

export interface PaginatedGroupsDto {
  page: number;
  limit: number;
  total_items: number;
  pages: number;
  items: GroupDto[];
}

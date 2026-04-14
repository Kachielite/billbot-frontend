import { z } from 'zod';

// ── Request schemas (Zod) ─────────────────────────────────────────────────────
export const createGroupSchema = z.object({
  name: z.string().min(1, 'Group name is required').max(100),
  description: z.string().max(500).optional(),
});
export type CreateGroupSchemaType = z.infer<typeof createGroupSchema>;

// ── Response DTOs ─────────────────────────────────────────────────────────────
export interface GroupDto {
  id: string;
  name: string;
  description: string | null;
  invite_code: string;
  created_by: string | null;
  created_at: string;
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

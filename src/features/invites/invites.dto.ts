import { z } from 'zod';

// ── Request schemas (Zod) ─────────────────────────────────────────────────────
export const createInviteSchema = z
  .object({
    phone: z
      .string()
      .regex(/^\+[1-9]\d{1,14}$/, 'Enter a valid international phone number')
      .optional(),
    email: z.string().email('Invalid email').optional(),
  })
  .refine((data) => data.phone || data.email, {
    message: 'Provide either a phone number or email address',
  });
export type CreateInviteSchemaType = z.infer<typeof createInviteSchema>;

export const joinGroupSchema = z.object({
  token: z.string().min(1, 'Invite code is required'),
});
export type JoinGroupSchemaType = z.infer<typeof joinGroupSchema>;

export const joinGroupByCodeSchema = z.object({
  code: z.string().min(1, 'Invite code is required'),
});
export type JoinGroupByCodeSchemaType = z.infer<typeof joinGroupByCodeSchema>;

// ── Response DTOs ─────────────────────────────────────────────────────────────
export interface InviteDto {
  id: string;
  group_id: string;
  invited_by: string | null;
  phone: string | null;
  email: string | null;
  token: string;
  status: 'pending' | 'accepted' | 'expired';
  expires_at: string;
  created_at: string;
}

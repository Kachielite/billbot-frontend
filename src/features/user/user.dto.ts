import { z } from 'zod';

// Response DTO for user data transfer
export interface UserResponse {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  created_at: string;
}

// ── Request schemas (Zod) ─────────────────────────────────────────────────────
export const updateProfileSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100).optional(),
  email: z.string().email('Invalid email').nullable().optional(),
  phone: z
    .string()
    .regex(/^\+[1-9]\d{1,14}$/, 'Enter a valid international phone number e.g. +2348012345678')
    .nullable()
    .optional(),
  currency_id: z.number().optional(),
});
export type UpdateProfileSchemaType = z.infer<typeof updateProfileSchema>;

// ── Response DTOs ─────────────────────────────────────────────────────────────
export interface CurrencyDto {
  id: number;
  code: string;
  symbol: string;
}

export interface UserProfileDto {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  avatar_url: string | null;
  currency: CurrencyDto;
  created_at: string;
}

export interface UserSummaryDto {
  id: string;
  name: string;
  email: string | null;
  avatar_url: string | null;
}

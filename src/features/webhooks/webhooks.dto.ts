import { z } from 'zod';

export const webhookEventTypes = [
  'group.created',
  'member.invited',
  'member.joined',
  'member.removed',
  'pool.created',
  'pool.settled',
  'pool.member_added',
  'expense.created',
  'expense.deleted',
  'settlement.submitted',
  'settlement.confirmed',
  'settlement.disputed',
] as const;
export type WebhookEventType = (typeof webhookEventTypes)[number];

// ── Request schemas (Zod) ─────────────────────────────────────────────────────
export const registerWebhookSchema = z.object({
  url: z.string().url('Enter a valid HTTPS URL'),
  events: z.array(z.enum(webhookEventTypes)).min(1, 'Select at least one event'),
});
export type RegisterWebhookSchemaType = z.infer<typeof registerWebhookSchema>;

// ── Response DTOs ─────────────────────────────────────────────────────────────
export interface WebhookDto {
  id: string;
  group_id: string;
  url: string;
  events: WebhookEventType[];
  created_by: string | null;
  created_at: string;
  secret?: string;
}

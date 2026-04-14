import type { WebhookEventType } from './webhooks.dto';

export interface Webhook {
  id: string;
  groupId: string;
  url: string;
  events: WebhookEventType[];
  createdBy: string | null;
  createdAt: Date;
  secret?: string;
}

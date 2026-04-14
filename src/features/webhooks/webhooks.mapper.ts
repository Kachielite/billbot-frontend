import { WebhookDto } from './webhooks.dto';
import { Webhook } from './webhooks.interface';

export const mapWebhookFromDto = (dto: WebhookDto): Webhook => ({
  id: dto.id,
  groupId: dto.group_id,
  url: dto.url,
  events: dto.events,
  createdBy: dto.created_by,
  createdAt: new Date(dto.created_at),
  secret: dto.secret,
});

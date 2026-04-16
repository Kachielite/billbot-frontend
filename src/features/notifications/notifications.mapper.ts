import { NotificationDto } from './notifications.dto';
import { Notification } from './notifications.interface';

export const mapNotificationFromDto = (dto: NotificationDto): Notification => ({
  id: dto.id,
  userId: dto.user_id,
  type: dto.type,
  title: dto.title,
  body: dto.body,
  metadata: dto.metadata,
  isRead: dto.is_read,
  createdAt: new Date(dto.created_at),
});

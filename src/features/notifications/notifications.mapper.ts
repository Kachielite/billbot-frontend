import { NotificationDto } from './notifications.dto';
import { Notification } from './notifications.interface';

export const mapNotificationFromDto = (dto: NotificationDto): Notification => ({
  id: dto.id,
  userId: dto.userId,
  type: dto.type,
  title: dto.title,
  body: dto.body,
  metadata: dto.metadata,
  isRead: dto.isRead,
  createdAt: new Date(dto.createdAt),
});

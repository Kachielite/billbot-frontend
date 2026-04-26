export interface NotificationDto {
  id: string;
  userId: string;
  type: string;
  title: string;
  body: string;
  metadata: Record<string, unknown>;
  isRead: boolean;
  createdAt: string;
}

export interface NotificationsResponseDto {
  items: NotificationDto[];
  total_items: number;
  page: number;
  limit: number;
  pages: number;
  unread: number;
}

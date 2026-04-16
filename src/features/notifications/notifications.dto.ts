export interface NotificationDto {
  id: string;
  user_id: string;
  type: string;
  title: string;
  body: string;
  metadata: Record<string, unknown>;
  is_read: boolean;
  created_at: string;
}

export interface NotificationsResponseDto {
  items: NotificationDto[];
  total_items: number;
  page: number;
  limit: number;
  pages: number;
  unread: number;
}

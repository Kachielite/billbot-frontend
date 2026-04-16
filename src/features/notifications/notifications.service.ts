import { customAxios } from '@/core/common/network/custom-axios';
import { mapAxiosErrorToAppError } from '@/core/common/error';
import { API_ENDPOINTS } from '@/core/common/network/api-endpoints';
import { PaginationParams } from '@/core/common/interface/pagination.interface';
import { Notification } from './notifications.interface';
import { mapNotificationFromDto } from './notifications.mapper';
import { NotificationsResponseDto } from './notifications.dto';

export const NotificationsService = {
  listNotifications: async (
    params?: PaginationParams,
  ): Promise<{
    items: Notification[];
    unread: number;
    page: number;
    limit: number;
    total_items: number;
    pages: number;
  }> => {
    try {
      const response = await customAxios.get<NotificationsResponseDto>(
        API_ENDPOINTS.NOTIFICATIONS,
        { params },
      );
      return {
        items: response.data.items.map(mapNotificationFromDto),
        unread: response.data.unread,
        page: response.data.page,
        limit: response.data.limit,
        total_items: response.data.total_items,
        pages: response.data.pages,
      };
    } catch (error) {
      throw mapAxiosErrorToAppError(error);
    }
  },

  markRead: async (id: string): Promise<void> => {
    try {
      await customAxios.patch(API_ENDPOINTS.NOTIFICATION_READ(id));
    } catch (error) {
      throw mapAxiosErrorToAppError(error);
    }
  },

  markAllRead: async (): Promise<void> => {
    try {
      await customAxios.patch(API_ENDPOINTS.NOTIFICATIONS_READ_ALL);
    } catch (error) {
      throw mapAxiosErrorToAppError(error);
    }
  },
};

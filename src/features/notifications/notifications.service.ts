import { customAxios } from '@/core/common/network/custom-axios';
import { mapAxiosErrorToAppError } from '@/core/common/error';
import { API_ENDPOINTS } from '@/core/common/network/api-endpoints';
import { PaginationParams } from '@/core/common/interface/pagination.interface';
import { Notification } from './notifications.interface';
import { mapNotificationFromDto } from './notifications.mapper';
import { NotificationsResponseDto } from './notifications.dto';
import {
  NotificationPreferences,
  NotificationPreferencesUpdate,
} from './notifications.push.interface';

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

  registerDeviceToken: async (playerId: string, platform: 'android' | 'ios'): Promise<void> => {
    try {
      await customAxios.post(API_ENDPOINTS.NOTIFICATIONS_DEVICE_TOKEN, {
        player_id: playerId,
        platform,
      });
    } catch (error) {
      throw mapAxiosErrorToAppError(error);
    }
  },

  unregisterDeviceToken: async (playerId: string): Promise<void> => {
    try {
      await customAxios.delete(API_ENDPOINTS.NOTIFICATIONS_DEVICE_TOKEN_DELETE(playerId));
    } catch (error) {
      throw mapAxiosErrorToAppError(error);
    }
  },

  getPreferences: async (): Promise<NotificationPreferences> => {
    try {
      const response = await customAxios.get<NotificationPreferences>(
        API_ENDPOINTS.NOTIFICATIONS_PREFERENCES,
      );
      return response.data;
    } catch (error) {
      throw mapAxiosErrorToAppError(error);
    }
  },

  updatePreferences: async (
    updates: NotificationPreferencesUpdate,
  ): Promise<NotificationPreferences> => {
    try {
      const response = await customAxios.patch<NotificationPreferences>(
        API_ENDPOINTS.NOTIFICATIONS_PREFERENCES,
        updates,
      );
      return response.data;
    } catch (error) {
      throw mapAxiosErrorToAppError(error);
    }
  },
};

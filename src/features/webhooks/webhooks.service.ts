import { customAxios } from '@/core/common/network/custom-axios';
import { mapAxiosErrorToAppError } from '@/core/common/error';
import { API_ENDPOINTS } from '@/core/common/network/api-endpoints';
import { Webhook } from './webhooks.interface';
import { mapWebhookFromDto } from './webhooks.mapper';
import { RegisterWebhookSchemaType, WebhookDto } from './webhooks.dto';

export const WebhooksService = {
  listWebhooks: async (groupId: string): Promise<Webhook[]> => {
    try {
      const response = await customAxios.get<WebhookDto[]>(API_ENDPOINTS.GROUP_WEBHOOKS(groupId));
      return response.data.map(mapWebhookFromDto);
    } catch (error) {
      throw mapAxiosErrorToAppError(error);
    }
  },

  registerWebhook: async (groupId: string, data: RegisterWebhookSchemaType): Promise<Webhook> => {
    try {
      const response = await customAxios.post<WebhookDto>(
        API_ENDPOINTS.GROUP_WEBHOOKS(groupId),
        data,
      );
      return mapWebhookFromDto(response.data);
    } catch (error) {
      throw mapAxiosErrorToAppError(error);
    }
  },

  deleteWebhook: async (groupId: string, webhookId: string): Promise<void> => {
    try {
      await customAxios.delete(API_ENDPOINTS.GROUP_WEBHOOK_DELETE(groupId, webhookId));
    } catch (error) {
      throw mapAxiosErrorToAppError(error);
    }
  },
};

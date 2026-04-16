import { useMutation, useQueryClient } from 'react-query';
import { Toast } from 'toastify-react-native';
import { QUERY_KEYS } from '@/core/common/constants/query-keys';
import { AppError } from '@/core/common/error';
import { WebhooksService } from '../webhooks.service';

const useDeleteWebhook = (groupId: string) => {
  const queryClient = useQueryClient();

  const { isLoading: isDeleting, mutateAsync: deleteWebhook } = useMutation(
    'delete-webhook',
    async (webhookId: string) => WebhooksService.deleteWebhook(groupId, webhookId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([QUERY_KEYS.GROUP_WEBHOOKS, groupId]);
        Toast.success('Webhook deleted');
      },
      onError: (error: AppError) => {
        Toast.error(error.message ?? 'An error occurred');
      },
    },
  );

  return { deleteWebhook, isDeleting };
};

export default useDeleteWebhook;

import { useQuery } from 'react-query';
import { Toast } from 'toastify-react-native';
import { QUERY_KEYS } from '@/core/common/constants/query-keys';
import { AppError } from '@/core/common/error';
import { WebhooksService } from '../webhooks.service';

const useGroupWebhooks = (groupId: string) => {
  const { data, isLoading, error, refetch } = useQuery(
    [QUERY_KEYS.GROUP_WEBHOOKS, groupId],
    () => WebhooksService.listWebhooks(groupId),
    {
      enabled: !!groupId,
      onError: (err: AppError) => {
        Toast.error(err.message || 'Failed to load webhooks');
      },
    },
  );

  return { webhooks: data ?? [], isLoading, error, refetch };
};

export default useGroupWebhooks;

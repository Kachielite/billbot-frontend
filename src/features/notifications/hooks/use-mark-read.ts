import { useMutation, useQueryClient } from 'react-query';
import { Toast } from 'toastify-react-native';
import { QUERY_KEYS } from '@/core/common/constants/query-keys';
import { AppError } from '@/core/common/error';
import useNotificationsStore from '../notifications.state';
import { NotificationsService } from '../notifications.service';

const useMarkRead = () => {
  const queryClient = useQueryClient();
  const { decrementUnread } = useNotificationsStore();

  const { isLoading: isMarking, mutateAsync: markRead } = useMutation(
    'mark-notification-read',
    async (id: string) => NotificationsService.markRead(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(QUERY_KEYS.NOTIFICATIONS);
        decrementUnread();
      },
      onError: (error: AppError) => {
        Toast.error(error.message ?? 'An error occurred');
      },
    },
  );

  return { markRead, isMarking };
};

export default useMarkRead;

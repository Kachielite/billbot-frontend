import { useMutation, useQueryClient } from 'react-query';
import { Toast } from 'toastify-react-native';
import { QUERY_KEYS } from '@/core/common/constants/query-keys';
import { AppError } from '@/core/common/error';
import useNotificationsStore from '../notifications.state';
import { NotificationsService } from '../notifications.service';

const useMarkAllRead = () => {
  const queryClient = useQueryClient();
  const { clearUnread } = useNotificationsStore();

  const { isLoading: isMarking, mutateAsync: markAllRead } = useMutation(
    'mark-all-notifications-read',
    async () => NotificationsService.markAllRead(),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(QUERY_KEYS.NOTIFICATIONS);
        clearUnread();
      },
      onError: (error: AppError) => {
        Toast.error(error.message ?? 'An error occurred');
      },
    },
  );

  return { markAllRead, isMarking };
};

export default useMarkAllRead;

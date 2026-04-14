import { useQuery } from 'react-query';
import { Toast } from 'toastify-react-native';
import { QUERY_KEYS } from '@/core/common/constants/query-keys';
import { PaginationParams } from '@/core/common/interface/pagination.interface';
import { AppError } from '@/core/common/error';
import useNotificationsStore from '../notifications.state';
import { NotificationsService } from '../notifications.service';

const useNotifications = (params?: PaginationParams) => {
  const { setUnreadCount } = useNotificationsStore();

  const { data, isLoading, error, refetch } = useQuery(
    [QUERY_KEYS.NOTIFICATIONS, params],
    () => NotificationsService.listNotifications(params),
    {
      onSuccess: (res) => {
        setUnreadCount(res.unread);
      },
      onError: (err: AppError) => {
        Toast.error(err.message || 'Failed to load notifications');
      },
    },
  );

  return {
    notifications: data?.items ?? [],
    unreadCount: data?.unread ?? 0,
    isLoading,
    error,
    refetch,
  };
};

export default useNotifications;

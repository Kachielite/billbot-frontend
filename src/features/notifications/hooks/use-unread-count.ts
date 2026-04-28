import { useQuery } from 'react-query';
import { QUERY_KEYS } from '@/core/common/constants/query-keys';
import useNotificationsStore from '../notifications.state';
import { NotificationsService } from '../notifications.service';

const useUnreadCount = () => {
  const { setUnreadCount } = useNotificationsStore();

  useQuery(
    [QUERY_KEYS.NOTIFICATIONS, 'badge'],
    () => NotificationsService.listNotifications({ page: 1, limit: 1 }),
    {
      onSuccess: (res) => setUnreadCount(res.unread),
      refetchInterval: 60_000,
      refetchIntervalInBackground: false,
    },
  );
};

export default useUnreadCount;

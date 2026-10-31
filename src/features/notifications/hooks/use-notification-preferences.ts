import { useQuery } from 'react-query';
import { NotificationsService } from '../notifications.service';
import { QUERY_KEYS } from '@/core/common/constants/query-keys';

const useNotificationPreferences = () => {
  const {
    data: preferences,
    isLoading,
    refetch,
  } = useQuery(QUERY_KEYS.NOTIFICATION_PREFERENCES, () => NotificationsService.getPreferences());

  return { preferences, isLoading, refetch };
};

export default useNotificationPreferences;

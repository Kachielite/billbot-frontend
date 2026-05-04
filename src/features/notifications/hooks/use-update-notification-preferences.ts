import { useMutation, useQueryClient } from 'react-query';
import { NotificationsService } from '../notifications.service';
import { NotificationPreferencesUpdate } from '../notifications.push.interface';
import { QUERY_KEYS } from '@/core/common/constants/query-keys';
import { Toast } from 'toastify-react-native';
import { AppError } from '@/core/common/error';

const useUpdateNotificationPreferences = () => {
  const queryClient = useQueryClient();

  const { mutateAsync: updatePreferences, isLoading: isUpdating } = useMutation(
    'update-notification-preferences',
    (updates: NotificationPreferencesUpdate) => NotificationsService.updatePreferences(updates),
    {
      onSuccess: (updated) => {
        queryClient.setQueryData(QUERY_KEYS.NOTIFICATION_PREFERENCES, updated);
      },
      onError: (error: AppError) => {
        Toast.error(error.message ?? 'Failed to update notification preferences');
      },
    },
  );

  return { updatePreferences, isUpdating };
};

export default useUpdateNotificationPreferences;

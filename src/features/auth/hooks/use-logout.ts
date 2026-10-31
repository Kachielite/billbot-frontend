import { useMutation } from 'react-query';
import { OneSignal } from 'react-native-onesignal';
import { AuthenticationService } from '@/features/auth/auth.service';
import useAuthStore from '@/features/auth/auth.state';
import useUserStore from '@/features/user/user.state';
import { AppError } from '@/core/common/error';
import { Toast } from 'toastify-react-native';
import { NotificationsService } from '@/features/notifications/notifications.service';

const useLogout = () => {
  const { clearAuth } = useAuthStore();
  const { clearUser } = useUserStore();

  const { isLoading: isLoggingOut, mutate: logout } = useMutation(
    'logout',
    async () => {
      try {
        const playerId = await OneSignal.User.pushSubscription.getIdAsync();
        if (playerId) await NotificationsService.unregisterDeviceToken(playerId);
      } catch {
        // Non-critical — proceed with logout regardless
      }
      return AuthenticationService.logOut();
    },
    {
      onSuccess: () => {
        clearAuth();
        clearUser();
      },
      onError: (error: AppError) => {
        Toast.error(error.message || 'An error occurred during logout');
      },
    },
  );

  return {
    isLoggingOut,
    logout,
  };
};

export default useLogout;

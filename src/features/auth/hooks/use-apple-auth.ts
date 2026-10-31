import { useMutation } from 'react-query';
import { Platform } from 'react-native';
import { OneSignal } from 'react-native-onesignal';
import { AuthenticationService } from '@/features/auth/auth.service';
import useAuthStore from '@/features/auth/auth.state';
import useUserStore from '@/features/user/user.state';
import { Toast } from 'toastify-react-native';
import { AppError } from '@/core/common/error';
import { NotificationsService } from '@/features/notifications/notifications.service';

const useAppleAuth = () => {
  const { setToken } = useAuthStore();
  const { setUser } = useUserStore();

  const { isLoading: isLoggingInWithApple, mutateAsync: appleLoginHandler } = useMutation(
    'apple-auth',
    async () => {
      return AuthenticationService.loginApple();
    },
    {
      onSuccess: async (res) => {
        setToken(res.data.token);
        setUser(res.data.user);

        try {
          const playerId = await OneSignal.User.pushSubscription.getIdAsync();
          if (playerId) {
            const platform = Platform.OS === 'ios' ? 'ios' : 'android';
            await NotificationsService.registerDeviceToken(playerId, platform);
          }
        } catch {
          // Non-critical — proceed even if token registration fails
        }
      },
      onError: (error: AppError) => {
        Toast.error(error.message || 'An error occurred during Apple authentication');
      },
    },
  );

  return {
    isLoggingInWithApple,
    appleLoginHandler,
  };
};

export default useAppleAuth;

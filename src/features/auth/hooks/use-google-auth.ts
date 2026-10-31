import { useMutation } from 'react-query';
import { Platform } from 'react-native';
import { OneSignal } from 'react-native-onesignal';
import { AuthenticationService } from '@/features/auth/auth.service';
import useAuthStore from '@/features/auth/auth.state';
import useUserStore from '@/features/user/user.state';
import { Toast } from 'toastify-react-native';
import { AppError } from '@/core/common/error';
import { NotificationsService } from '@/features/notifications/notifications.service';

const useGoogleAuth = () => {
  const { setToken } = useAuthStore();
  const { setUser } = useUserStore();

  const { isLoading: isLoggingInWithGoogle, mutateAsync: googleLoginHandler } = useMutation(
    'google-auth',
    async () => {
      return AuthenticationService.loginGoogle();
    },
    {
      onSuccess: async (res) => {
        setToken(res.data.token);
        setUser(res.data.user);
        Toast.success('Login successfully');

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
        Toast.error(error.message || 'An error occurred during Google authentication');
      },
    },
  );

  return {
    isLoggingInWithGoogle,
    googleLoginHandler,
  };
};

export default useGoogleAuth;

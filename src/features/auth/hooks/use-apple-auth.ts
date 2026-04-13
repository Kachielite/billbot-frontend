import { useMutation } from 'react-query';
import { AuthenticationService } from '@/features/auth/auth.service';
import useAuthStore from '@/features/auth/auth.state';
import useUserStore from '@/features/user/user.state';
import { Toast } from 'toastify-react-native';
import { AppError } from '@/core/common/error';

const useAppleAuth = () => {
  const { setToken } = useAuthStore();
  const { setUser } = useUserStore();

  const { isLoading: isLoggingIn, mutateAsync: appleLoginHandler } = useMutation(
    'apple-auth',
    async () => {
      return AuthenticationService.loginGoogle();
    },
    {
      onSuccess: (res) => {
        setToken(res.data.token);
        setUser(res.data.user);
      },
      onError: (error: AppError) => {
        Toast.error(error.message || 'An error occurred during Apple authentication');
      },
    },
  );

  return {
    isLoggingIn,
    appleLoginHandler,
  };
};

export default useAppleAuth;

import { useMutation } from 'react-query';
import { AuthenticationService } from '@/features/auth/auth.service';
import useAuthStore from '@/features/auth/auth.state';
import useUserStore from '@/features/user/user.state';
import { Toast } from 'toastify-react-native';
import { AppError } from '@/core/common/error';

const useAppleAuth = () => {
  const { setToken } = useAuthStore();
  const { setUser } = useUserStore();

  const { isLoading: isLoggingInWithApple, mutateAsync: appleLoginHandler } = useMutation(
    'apple-auth',
    async () => {
      return AuthenticationService.loginApple();
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
    isLoggingInWithApple,
    appleLoginHandler,
  };
};

export default useAppleAuth;

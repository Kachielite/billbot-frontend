import { useMutation } from 'react-query';
import { AuthenticationService } from '@/features/auth/auth.service';
import useAuthStore from '@/features/auth/auth.state';
import useUserStore from '@/features/user/user.state';
import { Toast } from 'toastify-react-native';
import { AppError } from '@/core/common/error';

const useGoogleAuth = () => {
  const { setToken } = useAuthStore();
  const { setUser } = useUserStore();

  const { isLoading: isLoggingInWithGoogle, mutateAsync: googleLoginHandler } = useMutation(
    'google-auth',
    async () => {
      return AuthenticationService.loginGoogle();
    },
    {
      onSuccess: (res) => {
        setToken(res.data.token);
        setUser(res.data.user);
        Toast.success('Login successfully');
        // Navigation happens automatically via conditional rendering when auth state updates
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

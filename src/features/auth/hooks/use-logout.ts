import { useMutation } from 'react-query';
import { AuthenticationService } from '@/features/auth/auth.service';
import useAuthStore from '@/features/auth/auth.state';
import useUserStore from '@/features/user/user.state';
import { AppError } from '@/core/common/error';
import { Toast } from 'toastify-react-native';

const useLogout = () => {
  const { clearAuth } = useAuthStore();
  const { clearUser } = useUserStore();

  const { isLoading: isLoggingOut } = useMutation(
    'logout',
    async () => {
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
  };
};

export default useLogout;

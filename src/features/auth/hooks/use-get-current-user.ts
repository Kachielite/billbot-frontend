import useAuthStore from '@/features/auth/auth.state';
import { useQuery } from 'react-query';
import { AuthenticationService } from '@/features/auth/auth.service';
import { AppError } from '@/core/common/error';
import { Toast } from 'toastify-react-native';
import useUserStore from '@/features/user/user.state';

const useGetCurrentUser = () => {
  const { token } = useAuthStore();
  const { setUser } = useUserStore();

  const { isLoading: isLoadingUser } = useQuery(
    'current-user',
    async () => {
      return AuthenticationService.getCurrentUser();
    },
    {
      enabled: !!token,
      onSuccess: (res) => {
        setUser(res);
      },
      onError: (error: AppError) => {
        Toast.error(error.message || 'An error occurred while fetching current user data');
      },
    },
  );

  return {
    isLoadingUser,
  };
};

export default useGetCurrentUser;

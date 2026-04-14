import { useQuery } from 'react-query';
import { Toast } from 'toastify-react-native';
import { QUERY_KEYS } from '@/core/common/constants/query-keys';
import { AppError } from '@/core/common/error';
import { UserService } from '../user.service';

const useProfile = () => {
  const { data, isLoading, error, refetch } = useQuery(
    QUERY_KEYS.ME,
    () => UserService.getProfile(),
    {
      onError: (err: AppError) => {
        Toast.error(err.message || 'Failed to load profile');
      },
    },
  );

  return { profile: data ?? null, isLoading, error, refetch };
};

export default useProfile;

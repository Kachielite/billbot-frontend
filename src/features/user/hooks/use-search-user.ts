import { useQuery } from 'react-query';
import { Toast } from 'toastify-react-native';
import { QUERY_KEYS } from '@/core/common/constants/query-keys';
import { AppError } from '@/core/common/error';
import { UserService } from '../user.service';

const useSearchUser = (phone: string) => {
  const { data, isLoading, error } = useQuery(
    [QUERY_KEYS.USER_SEARCH, phone],
    () => UserService.searchByPhone(phone),
    {
      enabled: phone.length > 6,
      onError: (err: AppError) => {
        Toast.error(err.message || 'User not found');
      },
    },
  );

  return { result: data ?? null, isLoading, error };
};

export default useSearchUser;

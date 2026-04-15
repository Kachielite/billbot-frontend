import { useQuery } from 'react-query';
import { Toast } from 'toastify-react-native';
import { QUERY_KEYS } from '@/core/common/constants/query-keys';
import { AppError } from '@/core/common/error';
import useAuthStore from '@/features/auth/auth.state';
import { BalancesService } from '../balances.service';
import { UserBalances } from '../balances.interface';

const useUserBalances = () => {
  const { token } = useAuthStore();

  const { data, isLoading, error, refetch } = useQuery(
    [QUERY_KEYS.USER_BALANCES],
    () => BalancesService.getUserBalances(),
    {
      enabled: !!token,
      onError: (err: AppError) => {
        Toast.error(err.message || 'Failed to load balances');
      },
    },
  );

  const userBalances: UserBalances = data ?? { totalOwed: 0, totalOwedToMe: 0, currency: 'NGN' };

  return { userBalances, isLoading, error, refetch };
};

export default useUserBalances;

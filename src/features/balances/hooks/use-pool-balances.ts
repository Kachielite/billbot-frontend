import { useQuery } from 'react-query';
import { Toast } from 'toastify-react-native';
import { QUERY_KEYS } from '@/core/common/constants/query-keys';
import { AppError } from '@/core/common/error';
import useAuthStore from '@/features/auth/auth.state';
import { BalancesService } from '../balances.service';
import { BalanceEntry, MemberSummary } from '../balances.interface';

const usePoolBalances = (poolId: string) => {
  const { token } = useAuthStore();

  const { data, isLoading, error, refetch } = useQuery(
    [QUERY_KEYS.POOL_BALANCES, poolId],
    () => BalancesService.getPoolBalances(poolId),
    {
      enabled: !!poolId && !!token,
      onError: (err: AppError) => {
        Toast.error(err.message || 'Failed to load balances');
      },
    },
  );

  const balances: BalanceEntry[] = data?.balances ?? [];
  const memberSummary: MemberSummary[] = data?.memberSummary ?? [];

  return { balances, memberSummary, isLoading, error, refetch };
};

export default usePoolBalances;

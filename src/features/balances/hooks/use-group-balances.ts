import { useQuery } from 'react-query';
import { Toast } from 'toastify-react-native';
import { QUERY_KEYS } from '@/core/common/constants/query-keys';
import { AppError } from '@/core/common/error';
import useAuthStore from '@/features/auth/auth.state';
import { BalancesService } from '../balances.service';
import { BalanceEntry, MemberSummary } from '../balances.interface';

const useGroupBalances = (groupId: string) => {
  const { token } = useAuthStore();

  const { data, isLoading, error, refetch } = useQuery(
    [QUERY_KEYS.GROUP_BALANCES, groupId],
    () => BalancesService.getGroupBalances(groupId),
    {
      enabled: !!groupId && !!token,
      onError: (err: AppError) => {
        Toast.error(err.message || 'Failed to load group balances');
      },
    },
  );

  const totalAmount = data?.totalAmount ?? 0;
  const amountCollected = data?.amountCollected ?? 0;
  const outstanding = data?.outstanding ?? 0;
  const balances: BalanceEntry[] = data?.balances ?? [];
  const memberSummary: MemberSummary[] = data?.memberSummary ?? [];

  return {
    totalAmount,
    amountCollected,
    outstanding,
    balances,
    memberSummary,
    isLoading,
    error,
    refetch,
  };
};

export default useGroupBalances;

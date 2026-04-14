import { useQuery } from 'react-query';
import { Toast } from 'toastify-react-native';
import { QUERY_KEYS } from '@/core/common/constants/query-keys';
import { PaginationParams } from '@/core/common/interface/pagination.interface';
import { AppError } from '@/core/common/error';
import { ExpensesService } from '../expenses.service';

const usePoolExpenses = (poolId: string, params?: PaginationParams) => {
  const { data, isLoading, error, refetch } = useQuery(
    [QUERY_KEYS.POOL_EXPENSES, poolId, params],
    () => ExpensesService.listExpenses(poolId, params),
    {
      enabled: !!poolId,
      onError: (err: AppError) => {
        Toast.error(err.message || 'Failed to load expenses');
      },
    },
  );

  return { expenses: data?.items ?? [], pagination: data, isLoading, error, refetch };
};

export default usePoolExpenses;

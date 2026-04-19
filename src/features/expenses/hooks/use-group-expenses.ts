import { useState } from 'react';
import { useQuery } from 'react-query';
import { Toast } from 'toastify-react-native';
import { QUERY_KEYS } from '@/core/common/constants/query-keys';
import { AppError } from '@/core/common/error';
import { ExpenseListParams } from '../expenses.dto';
import { ExpensesService } from '../expenses.service';

const useGroupExpenses = (
  groupId: string,
  filters?: Pick<ExpenseListParams, 'status' | 'from' | 'to'>,
) => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);

  const params: ExpenseListParams = { page, limit, ...filters };

  const { data, isLoading, error, refetch } = useQuery(
    [QUERY_KEYS.GROUP_EXPENSES, groupId, params],
    () => ExpensesService.listGroupExpenses(groupId, params),
    {
      enabled: !!groupId,
      onError: (err: AppError) => {
        Toast.error(err.message || 'Failed to load group expenses');
      },
    },
  );

  return {
    expenses: data?.items ?? [],
    pagination: data
      ? { page: data.page, limit: data.limit, totalItems: data.total_items, pages: data.pages }
      : undefined,
    isLoading,
    error,
    refetch,
    page,
    setPage,
    limit,
    setLimit,
  };
};

export default useGroupExpenses;

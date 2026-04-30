import { useQuery } from 'react-query';
import { Toast } from 'toastify-react-native';
import { QUERY_KEYS } from '@/core/common/constants/query-keys';
import { AppError } from '@/core/common/error';
import { ExpensesService } from '../expenses.service';
import useExpensesStore from '@/features/expenses/expenses.state';

const useExpenseDetail = (poolId: string, expenseId: string) => {
  const { setSelectedExpense } = useExpensesStore();
  const { data, isLoading, error, refetch } = useQuery(
    [QUERY_KEYS.EXPENSE_DETAIL, poolId, expenseId],
    () => ExpensesService.getExpense(poolId, expenseId),
    {
      enabled: !!poolId && !!expenseId,
      onSuccess: (expense) => {
        setSelectedExpense(expense);
      },
      onError: (err: AppError) => {
        Toast.error(err.message || 'Failed to load expense');
      },
    },
  );

  return { expense: data ?? null, isLoading, error, refetch };
};

export default useExpenseDetail;

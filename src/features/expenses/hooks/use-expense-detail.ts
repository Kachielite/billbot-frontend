import { useQuery } from 'react-query';
import { Toast } from 'toastify-react-native';
import { QUERY_KEYS } from '@/core/common/constants/query-keys';
import { AppError } from '@/core/common/error';
import { ExpensesService } from '../expenses.service';

const useExpenseDetail = (expenseId: string) => {
  const { data, isLoading, error } = useQuery(
    [QUERY_KEYS.EXPENSE_DETAIL, expenseId],
    () => ExpensesService.getExpense(expenseId),
    {
      enabled: !!expenseId,
      onError: (err: AppError) => {
        Toast.error(err.message || 'Failed to load expense');
      },
    },
  );

  return { expense: data ?? null, isLoading, error };
};

export default useExpenseDetail;

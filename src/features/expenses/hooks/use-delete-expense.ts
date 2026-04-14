import { useMutation, useQueryClient } from 'react-query';
import { Toast } from 'toastify-react-native';
import { QUERY_KEYS } from '@/core/common/constants/query-keys';
import { AppError } from '@/core/common/error';
import { ExpensesService } from '../expenses.service';

const useDeleteExpense = (poolId: string) => {
  const queryClient = useQueryClient();

  const { isLoading: isDeleting, mutateAsync: deleteExpense } = useMutation(
    'delete-expense',
    async (expenseId: string) => ExpensesService.deleteExpense(expenseId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([QUERY_KEYS.POOL_EXPENSES, poolId]);
        queryClient.invalidateQueries([QUERY_KEYS.POOL_BALANCES, poolId]);
        Toast.success('Expense deleted');
      },
      onError: (error: AppError) => {
        Toast.error(error.message ?? 'An error occurred');
      },
    },
  );

  return { deleteExpense, isDeleting };
};

export default useDeleteExpense;

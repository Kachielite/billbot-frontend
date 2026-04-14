import { useMutation, useQueryClient } from 'react-query';
import { Toast } from 'toastify-react-native';
import { QUERY_KEYS } from '@/core/common/constants/query-keys';
import { AppError } from '@/core/common/error';
import { ExpensesService } from '../expenses.service';

const useCancelRecurrence = (poolId: string) => {
  const queryClient = useQueryClient();

  const { isLoading: isCancelling, mutateAsync: cancelRecurrence } = useMutation(
    'cancel-recurrence',
    async (expenseId: string) => ExpensesService.cancelRecurrence(poolId, expenseId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([QUERY_KEYS.POOL_EXPENSES, poolId]);
        Toast.success('Recurrence cancelled');
      },
      onError: (error: AppError) => {
        Toast.error(error.message ?? 'An error occurred');
      },
    },
  );

  return { cancelRecurrence, isCancelling };
};

export default useCancelRecurrence;

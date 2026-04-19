import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from 'react-query';
import { Asset } from 'react-native-image-picker';
import { Toast } from 'toastify-react-native';
import { QUERY_KEYS } from '@/core/common/constants/query-keys';
import { AppError } from '@/core/common/error';
import { logExpenseSchema, LogExpenseSchemaType } from '../expenses.dto';
import { ExpensesService } from '../expenses.service';

const useLogGroupExpense = (groupId: string) => {
  const queryClient = useQueryClient();

  const form = useForm<LogExpenseSchemaType>({
    resolver: zodResolver(logExpenseSchema),
    mode: 'onBlur',
    defaultValues: { currency: 'NGN', isRecurring: false },
  });

  const { isLoading: isLogging, mutateAsync: logExpense } = useMutation(
    'log-group-expense',
    ({ data, receipt }: { data: LogExpenseSchemaType; receipt?: Asset }) =>
      ExpensesService.logGroupExpense(groupId, data, receipt),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([QUERY_KEYS.GROUP_EXPENSES, groupId]);
        Toast.success('Expense logged successfully');
        form.reset();
      },
      onError: (error: AppError) => {
        Toast.error(error.message ?? 'An error occurred');
      },
    },
  );

  return { form, isLogging, logExpense };
};

export default useLogGroupExpense;

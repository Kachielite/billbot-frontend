import { useForm, UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from 'react-query';
import { Toast } from 'toastify-react-native';
import { QUERY_KEYS } from '@/core/common/constants/query-keys';
import { AppError } from '@/core/common/error';
import { logExpenseSchema, LogExpenseSchemaType } from '../expenses.dto';
import { ExpensesService } from '../expenses.service';
import useExpensesStore from '@/features/expenses/expenses.state';
import { useEffect } from 'react';
import useProfile from '@/features/user/hooks/use-profile';
import { useNavigation } from '@react-navigation/native';

export type LogExpenseFormReturn = UseFormReturn<LogExpenseSchemaType>;

const useLogExpense = (poolId: string) => {
  const queryClient = useQueryClient();
  const navigation = useNavigation();
  const { draftExpense, clearDraftExpense } = useExpensesStore();
  const { profile } = useProfile();

  const form: LogExpenseFormReturn = useForm<LogExpenseSchemaType>({
    resolver: zodResolver(logExpenseSchema),
    mode: 'onBlur',
    defaultValues: { currency: 'NGN', isRecurring: false },
  }) as LogExpenseFormReturn;

  const { isLoading: isLogging, mutateAsync: logExpense } = useMutation(
    'log-expense',
    async (data: LogExpenseSchemaType) => ExpensesService.logExpense(poolId, data),
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries([QUERY_KEYS.POOL_EXPENSES, poolId]);
        await queryClient.invalidateQueries([QUERY_KEYS.POOL_BALANCES, poolId]);
        Toast.success('Expense logged successfully');
        form.reset();
        clearDraftExpense();
        navigation.canGoBack() && navigation.goBack();
      },
      onError: (error: AppError) => {
        Toast.error(error.message ?? 'An error occurred');
      },
    },
  );

  const { setValue } = form;
  useEffect(() => {
    if (draftExpense) {
      const { parsedReceipt } = draftExpense;
      const receiptDescription = `${parsedReceipt?.merchant ?? ''} ${parsedReceipt?.description ?? ''}`;
      if (parsedReceipt?.amount != null) setValue('amount', parsedReceipt.amount);
      setValue('currency', parsedReceipt?.currency ?? profile?.currency ?? 'NGN');
      setValue('description', receiptDescription ?? '');
      setValue('categoryId', parsedReceipt?.categoryId ?? undefined);
    }
  }, [draftExpense, setValue, profile?.currency]);

  const onLogExpense = async () => {
    await form.handleSubmit(async (data) => {
      const payload: LogExpenseSchemaType = {
        ...data,
        isRecurring: (data as LogExpenseSchemaType).isRecurring ?? false,
      } as LogExpenseSchemaType;

      await logExpense(payload);
    })();
  };

  return { form, isLogging, onLogExpense };
};

export default useLogExpense;

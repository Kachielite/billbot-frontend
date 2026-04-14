import { useMutation } from 'react-query';
import { Asset } from 'react-native-image-picker';
import { Toast } from 'toastify-react-native';
import { AppError } from '@/core/common/error';
import { ExpensesService } from '../expenses.service';
import useExpensesStore from '../expenses.state';

const useParseReceipt = (poolId: string) => {
  const { setDraftExpense } = useExpensesStore();

  const {
    isLoading: isParsing,
    mutateAsync: parseReceipt,
    data: result,
  } = useMutation(
    'parse-receipt',
    async (image: Asset) => ExpensesService.parseReceipt(poolId, image),
    {
      onSuccess: (data) => {
        setDraftExpense({
          parsedReceipt: data.parsed ?? undefined,
          receiptUrl: data.receiptUrl,
        });
      },
      onError: (error: AppError) => {
        Toast.error(error.message ?? 'Failed to parse receipt');
      },
    },
  );

  return { parseReceipt, result: result ?? null, isParsing };
};

export default useParseReceipt;

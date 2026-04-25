import { useMutation } from 'react-query';
import { Asset } from 'react-native-image-picker';
import { Toast } from 'toastify-react-native';
import { AppError } from '@/core/common/error';
import { ExpensesService } from '../expenses.service';
import useExpensesStore from '../expenses.state';
import { useNavigation } from '@react-navigation/native';

const useParseReceipt = (poolId: string) => {
  const { setDraftExpense, setIsParsingReceipt } = useExpensesStore();
  const navigation = useNavigation();

  const {
    isLoading: isParsing,
    mutateAsync: parseReceipt,
    data: result,
  } = useMutation(
    'parse-receipt',
    async (image: Asset) => {
      setIsParsingReceipt(true);
      return ExpensesService.parseReceipt(poolId, image);
    },
    {
      onSuccess: (data) => {
        setDraftExpense({
          parsedReceipt: data.parsed ?? undefined,
          receiptUrl: data.receiptUrl,
        });
        setIsParsingReceipt(false);
        navigation.navigate('NewExpense');
      },
      onError: (error: AppError) => {
        setIsParsingReceipt(false);
        Toast.error(error.message ?? 'Failed to parse receipt');
      },
    },
  );

  return { parseReceipt, result: result ?? null, isParsing };
};

export default useParseReceipt;

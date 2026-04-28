import { useQuery } from 'react-query';
import { Toast } from 'toastify-react-native';
import { QUERY_KEYS } from '@/core/common/constants/query-keys';
import { AppError } from '@/core/common/error';
import { UserService } from '../user.service';

const useCurrencies = () => {
  const { data, isLoading } = useQuery(QUERY_KEYS.CURRENCIES, () => UserService.getCurrencies(), {
    staleTime: Infinity,
    onError: (err: AppError) => {
      Toast.error(err.message ?? 'Failed to load currencies');
    },
  });

  return { currencies: data ?? [], isLoading };
};

export default useCurrencies;

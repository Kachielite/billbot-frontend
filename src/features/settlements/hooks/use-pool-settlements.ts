import { useQuery } from 'react-query';
import { Toast } from 'toastify-react-native';
import { QUERY_KEYS } from '@/core/common/constants/query-keys';
import { AppError } from '@/core/common/error';
import { SettlementsService } from '../settlements.service';

const usePoolSettlements = (poolId: string) => {
  const { data, isLoading, error, refetch } = useQuery(
    [QUERY_KEYS.POOL_SETTLEMENTS, poolId],
    () => SettlementsService.listSettlements(poolId),
    {
      enabled: !!poolId,
      onError: (err: AppError) => {
        Toast.error(err.message || 'Failed to load settlements');
      },
    },
  );

  return { settlements: data ?? [], isLoading, error, refetch };
};

export default usePoolSettlements;

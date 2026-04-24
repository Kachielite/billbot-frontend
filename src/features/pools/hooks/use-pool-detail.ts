import { useQuery } from 'react-query';
import { Toast } from 'toastify-react-native';
import { QUERY_KEYS } from '@/core/common/constants/query-keys';
import { AppError } from '@/core/common/error';
import { PoolsService } from '../pools.service';
import usePoolsStore from '@/features/pools/pools.state';

const usePoolDetail = (poolId: string) => {
  const { setSelectedPool } = usePoolsStore();
  const { data, isLoading, error, refetch } = useQuery(
    [QUERY_KEYS.POOL_DETAIL, poolId],
    () => PoolsService.getPoolDetail(poolId),
    {
      enabled: !!poolId,
      onSuccess: (pool) => {
        setSelectedPool(pool);
      },
      onError: (err: AppError) => {
        Toast.error(err.message || 'Failed to load pool');
      },
    },
  );

  return { pool: data ?? null, isLoading, error, refetch };
};

export default usePoolDetail;

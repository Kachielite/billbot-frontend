import { useQuery } from 'react-query';
import { Toast } from 'toastify-react-native';
import { QUERY_KEYS } from '@/core/common/constants/query-keys';
import { AppError } from '@/core/common/error';
import { PoolsService } from '../pools.service';

const useGroupPools = (groupId: string) => {
  const { data, isLoading, error, refetch } = useQuery(
    [QUERY_KEYS.GROUP_POOLS, groupId],
    () => PoolsService.listGroupPools(groupId),
    {
      enabled: !!groupId,
      onError: (err: AppError) => {
        Toast.error(err.message || 'Failed to load pools');
      },
    },
  );

  return { pools: data ?? [], isLoading, error, refetch };
};

export default useGroupPools;

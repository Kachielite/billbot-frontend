import { useMutation, useQueryClient } from 'react-query';
import { Toast } from 'toastify-react-native';
import { QUERY_KEYS } from '@/core/common/constants/query-keys';
import { AppError } from '@/core/common/error';
import { PoolsService } from '../pools.service';

const useDeletePool = (poolId: string, groupId: string) => {
  const queryClient = useQueryClient();

  const { isLoading: isDeleting, mutateAsync: deletePool } = useMutation(
    'delete-pool',
    async () => PoolsService.deletePool(poolId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([QUERY_KEYS.POOL_DETAIL, poolId]);
        queryClient.invalidateQueries([QUERY_KEYS.GROUP_POOLS, groupId]);
        Toast.success('Pool deleted');
      },
      onError: (error: AppError) => {
        Toast.error(error.message ?? 'An error occurred');
      },
    },
  );

  return { deletePool, isDeleting };
};

export default useDeletePool;

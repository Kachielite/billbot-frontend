import { useMutation, useQueryClient } from 'react-query';
import { Toast } from 'toastify-react-native';
import { QUERY_KEYS } from '@/core/common/constants/query-keys';
import { AppError } from '@/core/common/error';
import { PoolsService } from '../pools.service';

const usePoolMembers = (poolId: string) => {
  const queryClient = useQueryClient();

  const { isLoading: isAddingMember, mutateAsync: addMember } = useMutation(
    'add-pool-member',
    async (userId: string) => PoolsService.addMember(poolId, userId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([QUERY_KEYS.POOL_DETAIL, poolId]);
        Toast.success('Member added');
      },
      onError: (error: AppError) => {
        Toast.error(error.message ?? 'An error occurred');
      },
    },
  );

  const { isLoading: isRemovingMember, mutateAsync: removeMember } = useMutation(
    'remove-pool-member',
    async (userId: string) => PoolsService.removeMember(poolId, userId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([QUERY_KEYS.POOL_DETAIL, poolId]);
        Toast.success('Member removed');
      },
      onError: (error: AppError) => {
        Toast.error(error.message ?? 'An error occurred');
      },
    },
  );

  const isLoading = isAddingMember || isRemovingMember;

  return { addMember, removeMember, isLoading };
};

export default usePoolMembers;

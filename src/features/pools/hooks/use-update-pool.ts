import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from 'react-query';
import { Toast } from 'toastify-react-native';
import { QUERY_KEYS } from '@/core/common/constants/query-keys';
import { AppError } from '@/core/common/error';
import { updatePoolSchema, UpdatePoolSchemaType } from '../pools.dto';
import { PoolsService } from '../pools.service';

const useUpdatePool = (poolId: string) => {
  const queryClient = useQueryClient();

  const form = useForm<UpdatePoolSchemaType>({
    resolver: zodResolver(updatePoolSchema),
    mode: 'onBlur',
  });

  const { isLoading: isUpdating, mutateAsync: updatePool } = useMutation(
    'update-pool',
    async (data: UpdatePoolSchemaType) => PoolsService.updatePool(poolId, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([QUERY_KEYS.POOL_DETAIL, poolId]);
        Toast.success('Pool updated successfully');
        form.reset();
      },
      onError: (error: AppError) => {
        Toast.error(error.message ?? 'An error occurred');
      },
    },
  );

  return { form, isUpdating, updatePool };
};

export default useUpdatePool;

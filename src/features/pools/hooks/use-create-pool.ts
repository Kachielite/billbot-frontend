import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from 'react-query';
import { Toast } from 'toastify-react-native';
import { QUERY_KEYS } from '@/core/common/constants/query-keys';
import { AppError } from '@/core/common/error';
import { createPoolSchema, CreatePoolSchemaType } from '../pools.dto';
import { PoolsService } from '../pools.service';

const useCreatePool = (groupId: string) => {
  const queryClient = useQueryClient();

  const form = useForm<CreatePoolSchemaType>({
    resolver: zodResolver(createPoolSchema),
    mode: 'onBlur',
    defaultValues: { name: '', description: '', memberIds: [] },
  });

  const { isLoading: isCreating, mutateAsync: createPool } = useMutation(
    'create-pool',
    async (data: CreatePoolSchemaType) => PoolsService.createPool(groupId, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([QUERY_KEYS.GROUP_POOLS, groupId]);
        Toast.success('Pool created successfully');
        form.reset();
      },
      onError: (error: AppError) => {
        Toast.error(error.message ?? 'An error occurred');
      },
    },
  );

  return { form, isCreating, createPool };
};

export default useCreatePool;

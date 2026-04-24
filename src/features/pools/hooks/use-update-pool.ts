import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from 'react-query';
import { Toast } from 'toastify-react-native';
import { QUERY_KEYS } from '@/core/common/constants/query-keys';
import { AppError } from '@/core/common/error';
import { updatePoolSchema, UpdatePoolSchemaType } from '../pools.dto';
import { PoolsService } from '../pools.service';
import { useEffect } from 'react';
import usePoolsStore from '@/features/pools/pools.state';
import { useNavigation } from '@react-navigation/native';
import useGroupsStore from '@/features/groups/groups.state';

const useUpdatePool = (poolId: string) => {
  const navigation = useNavigation();
  const queryClient = useQueryClient();
  const { selectedPool } = usePoolsStore();
  const { selectedGroup } = useGroupsStore();

  const form = useForm<UpdatePoolSchemaType>({
    resolver: zodResolver(updatePoolSchema),
    mode: 'onBlur',
  });

  const { isLoading: isUpdating, mutateAsync: updatePool } = useMutation(
    'update-pool',
    async (data: UpdatePoolSchemaType) => PoolsService.updatePool(poolId, data),
    {
      onSuccess: async () => {
        // refresh pool detail
        await queryClient.invalidateQueries([QUERY_KEYS.POOL_DETAIL, poolId]);
        await queryClient.invalidateQueries(QUERY_KEYS.GROUP_POOLS);
        await queryClient.invalidateQueries(QUERY_KEYS.GROUP_DETAIL);
        Toast.success('Pool updated successfully');
        form.reset();
        navigation.goBack();
      },
      onError: (error: AppError) => {
        Toast.error(error.message ?? 'An error occurred');
      },
    },
  );

  const { setValue } = form;
  useEffect(() => {
    setValue('name', selectedPool?.name || '');
  }, []);

  const onUpdatePool = async () => {
    await form.handleSubmit((data) => updatePool(data))();
  };

  return { form, isUpdating, onUpdatePool };
};

export default useUpdatePool;

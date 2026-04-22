import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from 'react-query';
import { Toast } from 'toastify-react-native';
import { QUERY_KEYS } from '@/core/common/constants/query-keys';
import { AppError } from '@/core/common/error';
import { createPoolSchema, CreatePoolSchemaType } from '../pools.dto';
import { PoolsService } from '../pools.service';
import { useNavigation } from '@react-navigation/native';

const useCreatePool = (groupId: string) => {
  const queryClient = useQueryClient();
  const navigation = useNavigation();

  const form = useForm<CreatePoolSchemaType>({
    resolver: zodResolver(createPoolSchema),
    mode: 'onBlur',
    defaultValues: { name: '', description: '', memberIds: [] },
  });

  const { isLoading: isCreating, mutateAsync: createPool } = useMutation(
    'create-pool',
    async (data: CreatePoolSchemaType) => PoolsService.createPool(groupId, data),
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries([QUERY_KEYS.GROUP_POOLS, groupId]);
        form.reset();
        Toast.success('Pool created successfully');
        navigation.goBack();
      },
      onError: (error: AppError) => {
        Toast.error(error.message ?? 'An error occurred');
      },
    },
  );

  const createPoolHandler = async () => {
    await form.handleSubmit((data) => createPool(data))();
  };

  console.log('Form errors:', form.formState.errors);
  console.log('Form values:', form.getValues());

  return { form, isCreating, createPoolHandler };
};

export default useCreatePool;

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from 'react-query';
import { Toast } from 'toastify-react-native';
import { QUERY_KEYS } from '@/core/common/constants/query-keys';
import { AppError } from '@/core/common/error';
import { createGroupSchema, CreateGroupSchemaType } from '../groups.dto';
import { GroupsService } from '../groups.service';

const useCreateGroup = () => {
  const queryClient = useQueryClient();

  const form = useForm<CreateGroupSchemaType>({
    resolver: zodResolver(createGroupSchema),
    mode: 'onBlur',
    defaultValues: { name: '', description: '' },
  });

  const { isLoading: isCreating, mutateAsync: createGroup } = useMutation(
    'create-group',
    async (data: CreateGroupSchemaType) => GroupsService.createGroup(data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(QUERY_KEYS.GROUPS);
        Toast.success('Group created successfully');
        form.reset();
      },
      onError: (error: AppError) => {
        Toast.error(error.message ?? 'An error occurred');
      },
    },
  );

  return { form, isCreating, createGroup };
};

export default useCreateGroup;

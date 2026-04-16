import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from 'react-query';
import { Toast } from 'toastify-react-native';
import { QUERY_KEYS } from '@/core/common/constants/query-keys';
import { AppError } from '@/core/common/error';
import { createInviteSchema, CreateInviteSchemaType } from '../invites.dto';
import { InvitesService } from '../invites.service';

const useCreateInvite = (groupId: string) => {
  const queryClient = useQueryClient();

  const form = useForm<CreateInviteSchemaType>({
    resolver: zodResolver(createInviteSchema),
    mode: 'onBlur',
    defaultValues: { phone: '', email: '' },
  });

  const { isLoading: isInviting, mutateAsync: createInvite } = useMutation(
    'create-invite',
    async (data: CreateInviteSchemaType) => InvitesService.createInvite(groupId, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([QUERY_KEYS.GROUP_INVITES, groupId]);
        Toast.success('Invite sent successfully');
        form.reset();
      },
      onError: (error: AppError) => {
        Toast.error(error.message ?? 'An error occurred');
      },
    },
  );

  return { form, isInviting, createInvite };
};

export default useCreateInvite;

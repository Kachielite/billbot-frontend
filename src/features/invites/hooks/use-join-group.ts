import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from 'react-query';
import { Toast } from 'toastify-react-native';
import { QUERY_KEYS } from '@/core/common/constants/query-keys';
import { AppError } from '@/core/common/error';
import { joinGroupSchema, JoinGroupSchemaType } from '../invites.dto';
import { InvitesService } from '../invites.service';

const useJoinGroup = () => {
  const queryClient = useQueryClient();

  const form = useForm<JoinGroupSchemaType>({
    resolver: zodResolver(joinGroupSchema),
    mode: 'onBlur',
    defaultValues: { token: '' },
  });

  const { isLoading: isJoining, mutateAsync: joinGroup } = useMutation(
    'join-group',
    async (data: JoinGroupSchemaType) => InvitesService.joinGroup(data.token),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(QUERY_KEYS.GROUPS);
        Toast.success('Joined group successfully');
        form.reset();
      },
      onError: (error: AppError) => {
        Toast.error(error.message ?? 'An error occurred');
      },
    },
  );

  return { form, isJoining, joinGroup };
};

export default useJoinGroup;

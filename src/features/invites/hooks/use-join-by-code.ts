import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from 'react-query';
import { Toast } from 'toastify-react-native';
import { QUERY_KEYS } from '@/core/common/constants/query-keys';
import { AppError } from '@/core/common/error';
import { joinGroupByCodeSchema, JoinGroupByCodeSchemaType } from '../invites.dto';
import { InvitesService } from '../invites.service';

function getJoinErrorMessage(error: AppError): string {
  switch (error.status) {
    case 404:
      return 'Invalid invite code. Please check and try again.';
    case 400:
      return 'This invite code has already been used or has expired.';
    case 409:
      return 'You are already a member of this group.';
    default:
      return error.message || 'Failed to join group.';
  }
}

const useJoinByCode = () => {
  const queryClient = useQueryClient();

  const form = useForm<JoinGroupByCodeSchemaType>({
    resolver: zodResolver(joinGroupByCodeSchema),
    mode: 'onBlur',
    defaultValues: { code: '' },
  });

  const { isLoading: isJoining, mutateAsync: joinByCode } = useMutation(
    'join-group-by-code',
    (data: JoinGroupByCodeSchemaType) =>
      InvitesService.joinGroupByCode(data.code.trim().toUpperCase()),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(QUERY_KEYS.GROUPS);
        Toast.success('Joined group successfully!');
        form.reset();
      },
      onError: (error: AppError) => {
        Toast.error(getJoinErrorMessage(error));
      },
    },
  );

  return { form, isJoining, joinByCode };
};

export default useJoinByCode;

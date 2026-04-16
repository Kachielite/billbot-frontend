import { useMutation, useQueryClient } from 'react-query';
import { Toast } from 'toastify-react-native';
import { QUERY_KEYS } from '@/core/common/constants/query-keys';
import { AppError } from '@/core/common/error';
import { InvitesService } from '../invites.service';

const useCancelInvite = (groupId: string) => {
  const queryClient = useQueryClient();

  const { isLoading: isCancelling, mutateAsync: cancelInvite } = useMutation(
    'cancel-invite',
    async (inviteId: string) => InvitesService.cancelInvite(groupId, inviteId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([QUERY_KEYS.GROUP_INVITES, groupId]);
        Toast.success('Invite cancelled');
      },
      onError: (error: AppError) => {
        Toast.error(error.message ?? 'An error occurred');
      },
    },
  );

  return { cancelInvite, isCancelling };
};

export default useCancelInvite;

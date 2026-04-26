import { useMutation, useQueryClient } from 'react-query';
import { QUERY_KEYS } from '@/core/common/constants/query-keys';
import { AppError } from '@/core/common/error';
import { InvitesService } from '../invites.service';

function getJoinErrorMessage(error: AppError): string {
  switch (error.status) {
    case 404:
      return 'This invite link is invalid.';
    case 400:
      return 'This invite has already been used or has expired.';
    case 409:
      return 'You are already a member of this group.';
    default:
      return error.message || 'Failed to join group.';
  }
}

const useJoinByToken = () => {
  const queryClient = useQueryClient();

  const {
    isLoading: isJoining,
    mutateAsync: joinByToken,
    error,
  } = useMutation('join-group-by-token', (token: string) => InvitesService.joinGroup(token), {
    onSuccess: () => {
      queryClient.invalidateQueries(QUERY_KEYS.GROUPS);
    },
  });

  return {
    joinByToken,
    isJoining,
    getErrorMessage: (err: AppError) => getJoinErrorMessage(err),
  };
};

export default useJoinByToken;

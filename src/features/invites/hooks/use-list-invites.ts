import { useQuery } from 'react-query';
import { Toast } from 'toastify-react-native';
import { QUERY_KEYS } from '@/core/common/constants/query-keys';
import { AppError } from '@/core/common/error';
import { InvitesService } from '../invites.service';

const useListInvites = (groupId: string) => {
  const { data, isLoading, error, refetch } = useQuery(
    [QUERY_KEYS.GROUP_INVITES, groupId],
    () => InvitesService.listInvites(groupId),
    {
      enabled: !!groupId,
      onError: (err: AppError) => {
        Toast.error(err.message || 'Failed to load invites');
      },
    },
  );

  return { invites: data ?? [], isLoading, error, refetch };
};

export default useListInvites;

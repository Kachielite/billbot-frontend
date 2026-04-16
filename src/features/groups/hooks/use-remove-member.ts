import { useMutation, useQueryClient } from 'react-query';
import { Toast } from 'toastify-react-native';
import { QUERY_KEYS } from '@/core/common/constants/query-keys';
import { AppError } from '@/core/common/error';
import { GroupsService } from '../groups.service';

const useRemoveMember = () => {
  const queryClient = useQueryClient();

  const { isLoading: isRemoving, mutateAsync: removeMember } = useMutation(
    'remove-group-member',
    async ({ groupId, userId }: { groupId: string; userId: string }) =>
      GroupsService.removeMember(groupId, userId),
    {
      onSuccess: (_data, { groupId }) => {
        queryClient.invalidateQueries([QUERY_KEYS.GROUP_DETAIL, groupId]);
        Toast.success('Member removed');
      },
      onError: (error: AppError) => {
        Toast.error(error.message ?? 'An error occurred');
      },
    },
  );

  return { removeMember, isRemoving };
};

export default useRemoveMember;

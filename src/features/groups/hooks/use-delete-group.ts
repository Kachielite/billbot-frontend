import { useMutation, useQueryClient } from 'react-query';
import { Toast } from 'toastify-react-native';
import { QUERY_KEYS } from '@/core/common/constants/query-keys';
import { AppError } from '@/core/common/error';
import { GroupsService } from '../groups.service';

const useDeleteGroup = () => {
  const queryClient = useQueryClient();

  const { isLoading: isDeleting, mutateAsync: deleteGroup } = useMutation(
    'delete-group',
    async (groupId: string) => GroupsService.deleteGroup(groupId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(QUERY_KEYS.GROUPS);
        Toast.success('Group deleted');
      },
      onError: (error: AppError) => {
        Toast.error(error.message ?? 'An error occurred');
      },
    },
  );

  return { deleteGroup, isDeleting };
};

export default useDeleteGroup;

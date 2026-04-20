import { useMutation, useQueryClient } from 'react-query';
import { Toast } from 'toastify-react-native';
import { QUERY_KEYS } from '@/core/common/constants/query-keys';
import { AppError } from '@/core/common/error';
import { UpdateGroupSchemaType } from '../groups.dto';
import { GroupsService } from '../groups.service';

const useUpdateGroup = (groupId: string) => {
  const queryClient = useQueryClient();

  const { isLoading: isUpdating, mutateAsync: updateGroup } = useMutation(
    'update-group',
    async (data: UpdateGroupSchemaType) => GroupsService.updateGroup(groupId, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([QUERY_KEYS.GROUP_DETAIL, groupId]);
        queryClient.invalidateQueries(QUERY_KEYS.GROUPS);
        Toast.success('Group updated');
      },
      onError: (error: AppError) => {
        Toast.error(error.message ?? 'An error occurred');
      },
    },
  );

  return { updateGroup, isUpdating };
};

export default useUpdateGroup;

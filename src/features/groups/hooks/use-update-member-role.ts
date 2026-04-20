import { useMutation, useQueryClient } from 'react-query';
import { Toast } from 'toastify-react-native';
import { QUERY_KEYS } from '@/core/common/constants/query-keys';
import { AppError } from '@/core/common/error';
import { UpdateMemberRoleSchemaType } from '../groups.dto';
import { GroupsService } from '../groups.service';

const useUpdateMemberRole = (groupId: string) => {
  const queryClient = useQueryClient();

  const { isLoading: isUpdatingRole, mutateAsync: updateMemberRole } = useMutation(
    'update-member-role',
    async ({ userId, ...data }: UpdateMemberRoleSchemaType & { userId: string }) =>
      GroupsService.updateMemberRole(groupId, userId, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([QUERY_KEYS.GROUP_DETAIL, groupId]);
        Toast.success('Member role updated');
      },
      onError: (error: AppError) => {
        Toast.error(error.message ?? 'An error occurred');
      },
    },
  );

  return { updateMemberRole, isUpdatingRole };
};

export default useUpdateMemberRole;

import { useQuery } from 'react-query';
import { Toast } from 'toastify-react-native';
import { QUERY_KEYS } from '@/core/common/constants/query-keys';
import { AppError } from '@/core/common/error';
import { GroupsService } from '../groups.service';
import useGroupsStore from '@/features/groups/groups.state';

const useGroupDetail = (groupId: string) => {
  const { setSelectedGroup, selectedGroup } = useGroupsStore();
  const setGroupID = groupId || selectedGroup?.id;
  const { data, isLoading, error, refetch } = useQuery(
    [QUERY_KEYS.GROUP_DETAIL, setGroupID],
    () => GroupsService.getGroupDetail(setGroupID as string),
    {
      enabled: !!setGroupID,
      onSuccess: (data) => {
        setSelectedGroup(data);
      },
      onError: (err: AppError) => {
        Toast.error(err.message || 'Failed to load group');
      },
    },
  );

  return { group: data ?? null, isLoading, error, refetch };
};

export default useGroupDetail;

import { useQuery } from 'react-query';
import { Toast } from 'toastify-react-native';
import { QUERY_KEYS } from '@/core/common/constants/query-keys';
import { AppError } from '@/core/common/error';
import { GroupsService } from '../groups.service';

const useGroupDetail = (groupId: string) => {
  const { data, isLoading, error, refetch } = useQuery(
    [QUERY_KEYS.GROUP_DETAIL, groupId],
    () => GroupsService.getGroupDetail(groupId),
    {
      enabled: !!groupId,
      onError: (err: AppError) => {
        Toast.error(err.message || 'Failed to load group');
      },
    },
  );

  return { group: data ?? null, isLoading, error, refetch };
};

export default useGroupDetail;

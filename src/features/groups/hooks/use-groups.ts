import { useQuery } from 'react-query';
import { Toast } from 'toastify-react-native';
import { QUERY_KEYS } from '@/core/common/constants/query-keys';
import { AppError } from '@/core/common/error';
import { GroupsService } from '../groups.service';

const useGroups = () => {
  const { data, isLoading, error, refetch } = useQuery(
    QUERY_KEYS.GROUPS,
    () => GroupsService.listGroups(),
    {
      onError: (err: AppError) => {
        Toast.error(err.message || 'Failed to load groups');
      },
    },
  );

  return { groups: data ?? [], isLoading, error, refetch };
};

export default useGroups;

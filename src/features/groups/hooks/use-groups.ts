import { useState } from 'react';
import { useQuery } from 'react-query';
import { Toast } from 'toastify-react-native';
import { QUERY_KEYS } from '@/core/common/constants/query-keys';
import { AppError } from '@/core/common/error';
import { GroupsService } from '../groups.service';
import { Group } from '../groups.interface';

const EMPTY_GROUPS: Group[] = [];

const useGroups = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(6);
  const [includeMembers, setIncludeMembers] = useState(false);

  const { data, isLoading, error, refetch } = useQuery(
    [QUERY_KEYS.GROUPS, { page, limit, includeMembers }],
    () => GroupsService.listGroups({ page, limit, include_members: includeMembers }),
    {
      onError: (err: AppError) => {
        Toast.error(err.message || 'Failed to load groups');
      },
    },
  );

  return {
    groups: data?.groups ?? EMPTY_GROUPS,
    pagination: data
      ? { page: data.page, limit: data.limit, totalItems: data.totalItems, pages: data.pages }
      : undefined,
    isLoading,
    error,
    refetch,
    page,
    setPage,
    limit,
    setLimit,
    includeMembers,
    setIncludeMembers,
  };
};

export default useGroups;

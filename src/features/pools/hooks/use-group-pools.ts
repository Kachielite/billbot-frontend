import { useState } from 'react';
import { useQuery } from 'react-query';
import { Toast } from 'toastify-react-native';
import { QUERY_KEYS } from '@/core/common/constants/query-keys';
import { AppError } from '@/core/common/error';
import { PoolsService } from '../pools.service';

const useGroupPools = (groupId: string) => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);

  const { data, isLoading, error, refetch } = useQuery(
    [QUERY_KEYS.GROUP_POOLS, groupId, page, limit],
    () => PoolsService.listGroupPools(groupId, { page, limit }),
    {
      enabled: !!groupId,
      onError: (err: AppError) => {
        Toast.error(err.message || 'Failed to load pools');
      },
    },
  );

  return {
    pools: data?.pools ?? [],
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
  };
};

export default useGroupPools;

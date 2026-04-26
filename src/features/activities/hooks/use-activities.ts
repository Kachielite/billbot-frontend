import { useRef, useState } from 'react';
import { useQuery } from 'react-query';
import { Toast } from 'toastify-react-native';
import { QUERY_KEYS } from '@/core/common/constants/query-keys';
import { AppError } from '@/core/common/error';
import { ActivitiesService } from '../activities.service';
import { Activity } from '../activities.interface';

const useActivities = (initialLimit = 20) => {
  const [page, setPage] = useState(1);
  const [limit] = useState(initialLimit);
  const [poolId, setPoolIdRaw] = useState<string | undefined>(undefined);
  const [groupId, setGroupIdRaw] = useState<string | undefined>(undefined);
  const [from, setFromRaw] = useState<string | undefined>(undefined);
  const [to, setToRaw] = useState<string | undefined>(undefined);

  const [allItems, setAllItems] = useState<Activity[]>([]);
  // Ref so the data effect always reads the latest page without needing it as a dep
  const pageRef = useRef(page);
  pageRef.current = page;

  const params = { page, limit, pool_id: poolId, group_id: groupId, from, to };

  const { data, isLoading, isFetching, error, refetch } = useQuery(
    [QUERY_KEYS.USER_ACTIVITIES, params],
    () => ActivitiesService.getActivities(params),
    {
      onSuccess: (result) => {
        if (pageRef.current === 1) {
          setAllItems(result.items);
        } else {
          setAllItems((prev) => [...prev, ...result.items]);
        }
      },
      onError: (err: AppError) => {
        Toast.error(err.message || 'Failed to load activities');
      },
      keepPreviousData: true,
    },
  );

  const pagination = data
    ? { page: data.page, limit: data.limit, totalItems: data.total_items, pages: data.pages }
    : undefined;

  const hasMore = !!pagination && page < pagination.pages;

  const loadMore = () => {
    if (hasMore && !isFetching) setPage((p) => p + 1);
  };

  // Filter setters reset page so allItems accumulation starts fresh
  const setPoolId = (id: string | undefined) => {
    setPage(1);
    setPoolIdRaw(id);
  };
  const setGroupId = (id: string | undefined) => {
    setPage(1);
    setGroupIdRaw(id);
  };
  const setFrom = (val: string | undefined) => {
    setPage(1);
    setFromRaw(val);
  };
  const setTo = (val: string | undefined) => {
    setPage(1);
    setToRaw(val);
  };

  return {
    activities: data?.items ?? [],
    allItems: allItems.length > 0 ? allItems : (data?.items ?? []),
    pagination,
    isLoading,
    isFetching,
    hasMore,
    loadMore,
    error,
    refetch,
    page,
    poolId,
    setPoolId,
    groupId,
    setGroupId,
    from,
    setFrom,
    to,
    setTo,
  };
};

export default useActivities;

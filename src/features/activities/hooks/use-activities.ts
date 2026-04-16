import { useState } from 'react';
import { useQuery } from 'react-query';
import { Toast } from 'toastify-react-native';
import { QUERY_KEYS } from '@/core/common/constants/query-keys';
import { AppError } from '@/core/common/error';
import { ActivitiesService } from '../activities.service';

const useActivities = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);

  const { data, isLoading, error, refetch } = useQuery(
    [QUERY_KEYS.USER_ACTIVITIES, { page, limit }],
    () => ActivitiesService.getActivities({ page, limit }),
    {
      onError: (err: AppError) => {
        Toast.error(err.message || 'Failed to load activities');
      },
    },
  );

  return {
    activities: data?.items ?? [],
    pagination: data
      ? { page: data.page, limit: data.limit, totalItems: data.total_items, pages: data.pages }
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

export default useActivities;

import { useState } from 'react';
import { useQuery } from 'react-query';
import { Toast } from 'toastify-react-native';
import { QUERY_KEYS } from '@/core/common/constants/query-keys';
import { AppError } from '@/core/common/error';
import { ExpensesService } from '../expenses.service';

const useUpcomingExpenses = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);

  const { data, isLoading, error, refetch } = useQuery(
    [QUERY_KEYS.UPCOMING_EXPENSES, { page, limit }],
    () => ExpensesService.getUpcomingExpenses({ page, limit }),
    {
      onError: (err: AppError) => {
        Toast.error(err.message || 'Failed to load upcoming expenses');
      },
    },
  );

  return {
    upcomingExpenses: data?.items ?? [],
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

export default useUpcomingExpenses;

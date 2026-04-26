import { useRef, useState } from 'react';
import { useQuery } from 'react-query';
import { Toast } from 'toastify-react-native';
import { QUERY_KEYS } from '@/core/common/constants/query-keys';
import { AppError } from '@/core/common/error';
import { ExpensesService } from '../expenses.service';
import { UpcomingExpense } from '../expenses.interface';

const useUpcomingExpenses = (initialLimit = 10) => {
  const [page, setPage] = useState(1);
  const [limit] = useState(initialLimit);

  const [allItems, setAllItems] = useState<UpcomingExpense[]>([]);
  const pageRef = useRef(page);
  pageRef.current = page;

  const { data, isLoading, isFetching, error, refetch } = useQuery(
    [QUERY_KEYS.UPCOMING_EXPENSES, { page, limit }],
    () => ExpensesService.getUpcomingExpenses({ page, limit }),
    {
      onSuccess: (result) => {
        if (pageRef.current === 1) {
          setAllItems(result.items);
        } else {
          setAllItems((prev) => [...prev, ...result.items]);
        }
      },
      onError: (err: AppError) => {
        Toast.error(err.message || 'Failed to load upcoming expenses');
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

  return {
    upcomingExpenses: data?.items ?? [],
    allItems,
    pagination,
    isLoading,
    isFetching,
    hasMore,
    loadMore,
    error,
    refetch,
    page,
    setPage,
  };
};

export default useUpcomingExpenses;

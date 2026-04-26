import React from 'react';
import { useQuery } from 'react-query';
import { Toast } from 'toastify-react-native';
import { QUERY_KEYS } from '@/core/common/constants/query-keys';
import { AppError } from '@/core/common/error';
import useNotificationsStore from '../notifications.state';
import { NotificationsService } from '../notifications.service';
import { Notification } from '../notifications.interface';

const useNotifications = (initialLimit = 20) => {
  const [page, setPage] = React.useState(1);
  const [allItems, setAllItems] = React.useState<Notification[]>([]);
  const { setUnreadCount } = useNotificationsStore();

  const {
    data,
    isLoading,
    isFetching,
    error,
    refetch: refetchQuery,
  } = useQuery(
    [QUERY_KEYS.NOTIFICATIONS, { page, limit: initialLimit }],
    () => NotificationsService.listNotifications({ page, limit: initialLimit }),
    {
      keepPreviousData: true,
      onSuccess: (res) => {
        setUnreadCount(res.unread);
        setAllItems((prev) => {
          if (page === 1) return res.items;
          const seenIds = new Set(prev.map((n) => n.id));
          return [...prev, ...res.items.filter((n) => !seenIds.has(n.id))];
        });
      },
      onError: (err: AppError) => {
        Toast.error(err.message || 'Failed to load notifications');
      },
    },
  );

  const hasMore = data ? page < data.pages : false;

  const loadMore = () => {
    if (hasMore && !isFetching) setPage((p) => p + 1);
  };

  const refetch = async () => {
    setAllItems([]);
    setPage(1);
    await refetchQuery();
  };

  return {
    allItems: allItems.length > 0 ? allItems : (data?.items ?? []),
    unreadCount: data?.unread ?? 0,
    isLoading,
    isFetching,
    hasMore,
    loadMore,
    refetch,
    error,
  };
};

export default useNotifications;

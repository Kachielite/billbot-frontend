import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { QUERY_KEYS } from '@/core/common/constants/query-keys';
import { UserService } from '../user.service';
import { UserSummary } from '../user.interface';

const useSearchUser = (query: string) => {
  const [debouncedQuery, setDebouncedQuery] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query.trim()), 400);
    return () => clearTimeout(timer);
  }, [query]);

  const { data, isLoading } = useQuery<UserSummary[]>(
    [QUERY_KEYS.USER_SEARCH, debouncedQuery],
    () => UserService.searchUsers(debouncedQuery),
    { enabled: debouncedQuery.length >= 2 },
  );

  return { results: data ?? [], isLoading };
};

export default useSearchUser;

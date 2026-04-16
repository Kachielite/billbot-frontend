import { useQuery } from 'react-query';
import { Toast } from 'toastify-react-native';
import { QUERY_KEYS } from '@/core/common/constants/query-keys';
import { AppError } from '@/core/common/error';
import { CategoriesService } from '../categories.service';

const useCategories = () => {
  const { data, isLoading, error } = useQuery(
    QUERY_KEYS.CATEGORIES,
    () => CategoriesService.listCategories(),
    {
      staleTime: Infinity,
      onError: (err: AppError) => {
        Toast.error(err.message || 'Failed to load categories');
      },
    },
  );

  return { categories: data ?? [], isLoading, error };
};

export default useCategories;

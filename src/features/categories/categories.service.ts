import { customAxios } from '@/core/common/network/custom-axios';
import { mapAxiosErrorToAppError } from '@/core/common/error';
import { API_ENDPOINTS } from '@/core/common/network/api-endpoints';
import { Category } from './categories.interface';
import { mapCategoryFromDto } from './categories.mapper';
import { CategoryDto } from './categories.dto';

export const CategoriesService = {
  listCategories: async (): Promise<Category[]> => {
    try {
      const response = await customAxios.get<CategoryDto[]>(API_ENDPOINTS.CATEGORIES);
      return response.data.map(mapCategoryFromDto);
    } catch (error) {
      throw mapAxiosErrorToAppError(error);
    }
  },

  getCategory: async (categoryId: string): Promise<Category> => {
    try {
      const response = await customAxios.get<CategoryDto>(
        API_ENDPOINTS.CATEGORY_DETAIL(categoryId),
      );
      return mapCategoryFromDto(response.data);
    } catch (error) {
      throw mapAxiosErrorToAppError(error);
    }
  },
};

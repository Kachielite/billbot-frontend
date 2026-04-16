import { customAxios } from '@/core/common/network/custom-axios';
import { mapAxiosErrorToAppError } from '@/core/common/error';
import { API_ENDPOINTS } from '@/core/common/network/api-endpoints';
import { PaginatedResponse, PaginationParams } from '@/core/common/interface/pagination.interface';
import { Activity } from './activities.interface';
import { mapActivityFromDto } from './activities.mapper';
import { ActivityDto } from './activities.dto';

export const ActivitiesService = {
  getActivities: async (params?: PaginationParams): Promise<PaginatedResponse<Activity>> => {
    try {
      const response = await customAxios.get<{
        page: number;
        limit: number;
        total_items: number;
        pages: number;
        items: ActivityDto[];
      }>(API_ENDPOINTS.USER_ACTIVITIES, { params });
      return {
        ...response.data,
        items: response.data.items.map(mapActivityFromDto),
      };
    } catch (error) {
      throw mapAxiosErrorToAppError(error);
    }
  },
};

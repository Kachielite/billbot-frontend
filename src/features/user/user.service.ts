import { customAxios } from '@/core/common/network/custom-axios';
import { mapAxiosErrorToAppError } from '@/core/common/error';
import { API_ENDPOINTS } from '@/core/common/network/api-endpoints';
import { UserProfile, UserSummary } from './user.interface';
import { mapUserProfileFromDto, mapUserSummaryFromDto } from './user.mapper';
import { UpdateProfileSchemaType, UserProfileDto, UserSummaryDto } from './user.dto';

export const UserService = {
  getProfile: async (): Promise<UserProfile> => {
    try {
      const response = await customAxios.get<UserProfileDto>(API_ENDPOINTS.USERS_ME);
      return mapUserProfileFromDto(response.data);
    } catch (error) {
      throw mapAxiosErrorToAppError(error);
    }
  },

  updateProfile: async (data: UpdateProfileSchemaType): Promise<UserProfile> => {
    try {
      const response = await customAxios.put<UserProfileDto>(API_ENDPOINTS.USERS_ME, data);
      return mapUserProfileFromDto(response.data);
    } catch (error) {
      throw mapAxiosErrorToAppError(error);
    }
  },

  deleteAccount: async (): Promise<void> => {
    try {
      await customAxios.delete(API_ENDPOINTS.USERS_ME);
    } catch (error) {
      throw mapAxiosErrorToAppError(error);
    }
  },

  searchByPhone: async (phone: string): Promise<UserSummary> => {
    try {
      const response = await customAxios.get<UserSummaryDto>(API_ENDPOINTS.USERS_SEARCH, {
        params: { phone },
      });
      return mapUserSummaryFromDto(response.data);
    } catch (error) {
      throw mapAxiosErrorToAppError(error);
    }
  },
};

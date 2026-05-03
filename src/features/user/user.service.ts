import { customAxios } from '@/core/common/network/custom-axios';
import { mapAxiosErrorToAppError } from '@/core/common/error';
import { API_ENDPOINTS } from '@/core/common/network/api-endpoints';
import { Currency, UserProfile, UserSummary } from './user.interface';
import { mapCurrencyFromDto, mapUserProfileFromDto, mapUserSummaryFromDto } from './user.mapper';
import { CurrencyDto, UpdateProfileSchemaType, UserProfileDto, UserSummaryDto } from './user.dto';

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

  uploadAvatar: async (uri: string): Promise<UserProfile> => {
    try {
      const filename = uri.split('/').pop() ?? 'avatar.jpg';
      const ext = /\.(\w+)$/.exec(filename)?.[1] ?? 'jpg';
      const formData = new FormData();
      formData.append('avatar', { uri, name: filename, type: `image/${ext}` } as any);
      const response = await customAxios.patch<UserProfileDto>(
        API_ENDPOINTS.USERS_AVATAR,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } },
      );
      return mapUserProfileFromDto(response.data);
    } catch (error) {
      throw mapAxiosErrorToAppError(error);
    }
  },

  getCurrencies: async (): Promise<Currency[]> => {
    try {
      const response = await customAxios.get<CurrencyDto[]>(API_ENDPOINTS.USERS_CURRENCIES);
      return response.data.map(mapCurrencyFromDto);
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

  searchUsers: async (query: string): Promise<UserSummary[]> => {
    try {
      const response = await customAxios.get<UserSummaryDto[]>(API_ENDPOINTS.USERS_SEARCH, {
        params: { query },
      });
      return response.data.map(mapUserSummaryFromDto);
    } catch (error) {
      throw mapAxiosErrorToAppError(error);
    }
  },
};

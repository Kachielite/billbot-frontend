import { customAxios } from '@/core/common/network/custom-axios';
import { mapAxiosErrorToAppError } from '@/core/common/error';
import { API_ENDPOINTS } from '@/core/common/network/api-endpoints';
import { Group, GroupDetail } from './groups.interface';
import { mapGroupDetailFromDto, mapGroupFromDto } from './groups.mapper';
import { CreateGroupSchemaType, GroupDetailDto, GroupDto } from './groups.dto';

export const GroupsService = {
  listGroups: async (): Promise<Group[]> => {
    try {
      const response = await customAxios.get<GroupDto[]>(API_ENDPOINTS.GROUPS);
      return response.data.map(mapGroupFromDto);
    } catch (error) {
      throw mapAxiosErrorToAppError(error);
    }
  },

  getGroupDetail: async (groupId: string): Promise<GroupDetail> => {
    try {
      const response = await customAxios.get<GroupDetailDto>(API_ENDPOINTS.GROUP_DETAIL(groupId));
      return mapGroupDetailFromDto(response.data);
    } catch (error) {
      throw mapAxiosErrorToAppError(error);
    }
  },

  createGroup: async (data: CreateGroupSchemaType): Promise<Group> => {
    try {
      const response = await customAxios.post<GroupDto>(API_ENDPOINTS.GROUPS, data);
      return mapGroupFromDto(response.data);
    } catch (error) {
      throw mapAxiosErrorToAppError(error);
    }
  },

  deleteGroup: async (groupId: string): Promise<void> => {
    try {
      await customAxios.delete(API_ENDPOINTS.GROUP_DETAIL(groupId));
    } catch (error) {
      throw mapAxiosErrorToAppError(error);
    }
  },

  removeMember: async (groupId: string, userId: string): Promise<void> => {
    try {
      await customAxios.delete(API_ENDPOINTS.GROUP_REMOVE_MEMBER(groupId, userId));
    } catch (error) {
      throw mapAxiosErrorToAppError(error);
    }
  },
};

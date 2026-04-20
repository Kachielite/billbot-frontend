import { customAxios } from '@/core/common/network/custom-axios';
import { mapAxiosErrorToAppError } from '@/core/common/error';
import { API_ENDPOINTS } from '@/core/common/network/api-endpoints';
import { Group, GroupDetail, PaginatedGroups } from './groups.interface';
import { mapGroupDetailFromDto, mapGroupFromDto, mapPaginatedGroupsFromDto } from './groups.mapper';
import {
  CreateGroupSchemaType,
  GroupDetailDto,
  GroupDto,
  ListGroupsParamsDto,
  PaginatedGroupsDto,
  UpdateGroupSchemaType,
  UpdateMemberRoleSchemaType,
} from './groups.dto';

export const GroupsService = {
  listGroups: async (params?: ListGroupsParamsDto): Promise<PaginatedGroups> => {
    try {
      const response = await customAxios.get<PaginatedGroupsDto>(API_ENDPOINTS.GROUPS, { params });
      return mapPaginatedGroupsFromDto(response.data);
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

  updateGroup: async (groupId: string, data: UpdateGroupSchemaType): Promise<Group> => {
    try {
      const response = await customAxios.patch<GroupDto>(API_ENDPOINTS.GROUP_DETAIL(groupId), data);
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

  updateMemberRole: async (
    groupId: string,
    userId: string,
    data: UpdateMemberRoleSchemaType,
  ): Promise<void> => {
    try {
      await customAxios.patch(API_ENDPOINTS.GROUP_UPDATE_MEMBER_ROLE(groupId, userId), data);
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

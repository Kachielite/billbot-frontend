import { customAxios } from '@/core/common/network/custom-axios';
import { mapAxiosErrorToAppError } from '@/core/common/error';
import { API_ENDPOINTS } from '@/core/common/network/api-endpoints';
import { Invite } from './invites.interface';
import { mapInviteFromDto } from './invites.mapper';
import { CreateInviteSchemaType, InviteDto } from './invites.dto';

export const InvitesService = {
  createInvite: async (groupId: string, data: CreateInviteSchemaType): Promise<Invite> => {
    try {
      const response = await customAxios.post<InviteDto>(
        API_ENDPOINTS.GROUP_INVITES(groupId),
        data,
      );
      return mapInviteFromDto(response.data);
    } catch (error) {
      throw mapAxiosErrorToAppError(error);
    }
  },

  listInvites: async (groupId: string): Promise<Invite[]> => {
    try {
      const response = await customAxios.get<InviteDto[]>(API_ENDPOINTS.GROUP_INVITES(groupId));
      return response.data.map(mapInviteFromDto);
    } catch (error) {
      throw mapAxiosErrorToAppError(error);
    }
  },

  cancelInvite: async (groupId: string, inviteId: string): Promise<void> => {
    try {
      await customAxios.delete(API_ENDPOINTS.GROUP_INVITE_CANCEL(groupId, inviteId));
    } catch (error) {
      throw mapAxiosErrorToAppError(error);
    }
  },

  joinGroup: async (token: string): Promise<void> => {
    try {
      await customAxios.post(API_ENDPOINTS.GROUP_JOIN(token));
    } catch (error) {
      throw mapAxiosErrorToAppError(error);
    }
  },
};

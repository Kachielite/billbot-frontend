import { customAxios } from '@/core/common/network/custom-axios';
import { mapAxiosErrorToAppError } from '@/core/common/error';
import { API_ENDPOINTS } from '@/core/common/network/api-endpoints';
import { PaginatedPools, Pool, PoolDetail } from './pools.interface';
import { mapPaginatedPoolsFromDto, mapPoolDetailFromDto, mapPoolFromDto } from './pools.mapper';
import {
  CreatePoolSchemaType,
  PaginatedPoolsDto,
  PoolDetailDto,
  PoolDto,
  UpdatePoolSchemaType,
} from './pools.dto';

export const PoolsService = {
  listGroupPools: async (
    groupId: string,
    params?: { page?: number; limit?: number },
  ): Promise<PaginatedPools> => {
    try {
      const response = await customAxios.get<PaginatedPoolsDto>(
        API_ENDPOINTS.GROUP_POOLS(groupId),
        { params },
      );
      return mapPaginatedPoolsFromDto(response.data);
    } catch (error) {
      throw mapAxiosErrorToAppError(error);
    }
  },

  getPoolDetail: async (poolId: string): Promise<PoolDetail> => {
    try {
      const response = await customAxios.get<PoolDetailDto>(API_ENDPOINTS.POOL_DETAIL(poolId));
      return mapPoolDetailFromDto(response.data);
    } catch (error) {
      throw mapAxiosErrorToAppError(error);
    }
  },

  createPool: async (groupId: string, data: CreatePoolSchemaType): Promise<Pool> => {
    try {
      const response = await customAxios.post<PoolDto>(API_ENDPOINTS.GROUP_POOLS(groupId), data);
      return mapPoolFromDto(response.data);
    } catch (error) {
      throw mapAxiosErrorToAppError(error);
    }
  },

  updatePool: async (poolId: string, data: UpdatePoolSchemaType): Promise<Pool> => {
    try {
      const response = await customAxios.put<PoolDto>(API_ENDPOINTS.POOL_DETAIL(poolId), data);
      return mapPoolFromDto(response.data);
    } catch (error) {
      throw mapAxiosErrorToAppError(error);
    }
  },

  addMember: async (poolId: string, userId: string): Promise<void> => {
    try {
      await customAxios.post(API_ENDPOINTS.POOL_MEMBERS(poolId), { userId });
    } catch (error) {
      throw mapAxiosErrorToAppError(error);
    }
  },

  removeMember: async (poolId: string, userId: string): Promise<void> => {
    try {
      await customAxios.delete(API_ENDPOINTS.POOL_REMOVE_MEMBER(poolId, userId));
    } catch (error) {
      throw mapAxiosErrorToAppError(error);
    }
  },

  deletePool: async (poolId: string): Promise<void> => {
    try {
      await customAxios.delete(API_ENDPOINTS.POOL_DETAIL(poolId));
    } catch (error) {
      throw mapAxiosErrorToAppError(error);
    }
  },
};

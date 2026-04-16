import { customAxios } from '@/core/common/network/custom-axios';
import { mapAxiosErrorToAppError } from '@/core/common/error';
import { API_ENDPOINTS } from '@/core/common/network/api-endpoints';
import { PoolBalances, UserBalances } from './balances.interface';
import { mapPoolBalancesFromDto } from './balances.mapper';
import { PoolBalancesDto, UserBalancesDto } from './balances.dto';

export const BalancesService = {
  getPoolBalances: async (poolId: string): Promise<PoolBalances> => {
    try {
      const response = await customAxios.get<PoolBalancesDto>(API_ENDPOINTS.POOL_BALANCES(poolId));
      return mapPoolBalancesFromDto(response.data);
    } catch (error) {
      throw mapAxiosErrorToAppError(error);
    }
  },

  getUserBalances: async (): Promise<UserBalances> => {
    try {
      const response = await customAxios.get<UserBalancesDto>(API_ENDPOINTS.BALANCES);
      return response.data;
    } catch (error) {
      throw mapAxiosErrorToAppError(error);
    }
  },
};

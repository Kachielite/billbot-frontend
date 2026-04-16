import { Asset } from 'react-native-image-picker';
import { customAxios } from '@/core/common/network/custom-axios';
import { mapAxiosErrorToAppError } from '@/core/common/error';
import { API_ENDPOINTS } from '@/core/common/network/api-endpoints';
import { Settlement } from './settlements.interface';
import { mapSettlementFromDto } from './settlements.mapper';
import { SettlementDto, SubmitSettlementSchemaType } from './settlements.dto';

export const SettlementsService = {
  listSettlements: async (poolId: string): Promise<Settlement[]> => {
    try {
      const response = await customAxios.get<SettlementDto[]>(
        API_ENDPOINTS.POOL_SETTLEMENTS(poolId),
      );
      return response.data.map(mapSettlementFromDto);
    } catch (error) {
      throw mapAxiosErrorToAppError(error);
    }
  },

  getSettlement: async (settlementId: string): Promise<Settlement> => {
    try {
      const response = await customAxios.get<SettlementDto>(
        API_ENDPOINTS.SETTLEMENT_DETAIL(settlementId),
      );
      return mapSettlementFromDto(response.data);
    } catch (error) {
      throw mapAxiosErrorToAppError(error);
    }
  },

  submitSettlement: async (
    poolId: string,
    data: SubmitSettlementSchemaType,
    proof: Asset,
  ): Promise<Settlement> => {
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, String(value));
        }
      });
      if (proof?.uri) {
        formData.append('proof', {
          uri: proof.uri,
          type: proof.type ?? 'image/jpeg',
          name: proof.fileName ?? 'proof.jpg',
        } as unknown as Blob);
      }
      const response = await customAxios.post<SettlementDto>(
        API_ENDPOINTS.POOL_SETTLEMENTS(poolId),
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } },
      );
      return mapSettlementFromDto(response.data);
    } catch (error) {
      throw mapAxiosErrorToAppError(error);
    }
  },

  confirmSettlement: async (settlementId: string): Promise<void> => {
    try {
      await customAxios.post(API_ENDPOINTS.SETTLEMENT_CONFIRM(settlementId));
    } catch (error) {
      throw mapAxiosErrorToAppError(error);
    }
  },

  disputeSettlement: async (settlementId: string, reason: string): Promise<void> => {
    try {
      await customAxios.post(API_ENDPOINTS.SETTLEMENT_DISPUTE(settlementId), { reason });
    } catch (error) {
      throw mapAxiosErrorToAppError(error);
    }
  },
};

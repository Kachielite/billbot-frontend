import { useMutation, useQueryClient } from 'react-query';
import { Toast } from 'toastify-react-native';
import { QUERY_KEYS } from '@/core/common/constants/query-keys';
import { AppError } from '@/core/common/error';
import { SettlementsService } from '../settlements.service';

const useConfirmSettlement = (poolId: string) => {
  const queryClient = useQueryClient();

  const { isLoading: isConfirming, mutateAsync: confirmSettlement } = useMutation(
    'confirm-settlement',
    async (settlementId: string) => SettlementsService.confirmSettlement(settlementId),
    {
      onSuccess: (_data, settlementId) => {
        queryClient.invalidateQueries([QUERY_KEYS.POOL_SETTLEMENTS, poolId]);
        queryClient.invalidateQueries([QUERY_KEYS.SETTLEMENT_DETAIL, settlementId]);
        Toast.success('Settlement confirmed');
      },
      onError: (error: AppError) => {
        Toast.error(error.message ?? 'An error occurred');
      },
    },
  );

  return { confirmSettlement, isConfirming };
};

export default useConfirmSettlement;

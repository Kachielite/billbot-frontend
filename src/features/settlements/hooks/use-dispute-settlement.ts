import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from 'react-query';
import { Toast } from 'toastify-react-native';
import { QUERY_KEYS } from '@/core/common/constants/query-keys';
import { AppError } from '@/core/common/error';
import { disputeSettlementSchema, DisputeSettlementSchemaType } from '../settlements.dto';
import { SettlementsService } from '../settlements.service';

const useDisputeSettlement = (poolId: string) => {
  const queryClient = useQueryClient();

  const form = useForm<DisputeSettlementSchemaType>({
    resolver: zodResolver(disputeSettlementSchema),
    mode: 'onBlur',
    defaultValues: { reason: '' },
  });

  const { isLoading: isDisputing, mutateAsync: disputeSettlement } = useMutation(
    'dispute-settlement',
    async ({ settlementId, data }: { settlementId: string; data: DisputeSettlementSchemaType }) =>
      SettlementsService.disputeSettlement(settlementId, data.reason),
    {
      onSuccess: (_data, { settlementId }) => {
        queryClient.invalidateQueries([QUERY_KEYS.POOL_SETTLEMENTS, poolId]);
        queryClient.invalidateQueries([QUERY_KEYS.SETTLEMENT_DETAIL, settlementId]);
        Toast.success('Dispute submitted');
        form.reset();
      },
      onError: (error: AppError) => {
        Toast.error(error.message ?? 'An error occurred');
      },
    },
  );

  return { form, isDisputing, disputeSettlement };
};

export default useDisputeSettlement;

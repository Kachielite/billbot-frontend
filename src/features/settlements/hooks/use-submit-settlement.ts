import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from 'react-query';
import { Asset } from 'react-native-image-picker';
import { Toast } from 'toastify-react-native';
import { QUERY_KEYS } from '@/core/common/constants/query-keys';
import { AppError } from '@/core/common/error';
import { submitSettlementSchema, SubmitSettlementSchemaType } from '../settlements.dto';
import { SettlementsService } from '../settlements.service';

const useSubmitSettlement = (poolId: string) => {
  const queryClient = useQueryClient();

  const form = useForm<SubmitSettlementSchemaType>({
    resolver: zodResolver(submitSettlementSchema),
    mode: 'onBlur',
  });

  const { isLoading: isSubmitting, mutateAsync: submitSettlement } = useMutation(
    'submit-settlement',
    async ({ data, proof }: { data: SubmitSettlementSchemaType; proof: Asset }) =>
      SettlementsService.submitSettlement(poolId, data, proof),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([QUERY_KEYS.POOL_SETTLEMENTS, poolId]);
        queryClient.invalidateQueries([QUERY_KEYS.POOL_BALANCES, poolId]);
        Toast.success('Settlement submitted successfully');
        form.reset();
      },
      onError: (error: AppError) => {
        Toast.error(error.message ?? 'An error occurred');
      },
    },
  );

  return { form, isSubmitting, submitSettlement };
};

export default useSubmitSettlement;

import { useQuery } from 'react-query';
import { Toast } from 'toastify-react-native';
import { QUERY_KEYS } from '@/core/common/constants/query-keys';
import { AppError } from '@/core/common/error';
import { SettlementsService } from '../settlements.service';

const useSettlementDetail = (settlementId: string) => {
  const { data, isLoading, error } = useQuery(
    [QUERY_KEYS.SETTLEMENT_DETAIL, settlementId],
    () => SettlementsService.getSettlement(settlementId),
    {
      enabled: !!settlementId,
      onError: (err: AppError) => {
        Toast.error(err.message || 'Failed to load settlement');
      },
    },
  );

  return { settlement: data ?? null, isLoading, error };
};

export default useSettlementDetail;

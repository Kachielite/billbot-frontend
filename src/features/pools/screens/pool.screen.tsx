import { Platform, ScrollView, Text } from 'react-native';
import React from 'react';
import type { StaticScreenProps } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import ScreenContainer from '@/core/common/components/layout/screen-container';
import ConfirmDeleteModal from '@/core/common/components/confirm-delete-modal';
import usePoolDetail from '@/features/pools/hooks/use-pool-detail';
import useDeletePool from '@/features/pools/hooks/use-delete-pool';
import useGroupDetail from '@/features/groups/hooks/use-group-detail';
import useProfile from '@/features/user/hooks/use-profile';
import PoolHeader from '@/features/pools/components/pool.header';
import usePoolBalances from '@/features/balances/hooks/use-pool-balances';
import ScreenLoader from '@/core/common/components/screen.loader';
import PoolBalances from '@/features/pools/components/pool.balances';
import usePoolExpenses from '@/features/expenses/hooks/use-pool-expenses';
import PoolMemberSummary from '@/features/pools/components/pool.member-summary';
import PoolSettlement from '@/features/pools/components/pool.settlement';
import { Spacing } from '@/core/common/constants/theme';

type Props = StaticScreenProps<{ poolId: string }>;

export default function PoolScreen({ route }: Props) {
  const { poolId } = route.params;
  const { canGoBack, goBack } = useNavigation();

  const { pool, isLoading } = usePoolDetail(poolId);
  const {
    isLoading: isLoadingBalance,
    memberSummary,
    totalAmount,
    amountCollected,
    balances,
  } = usePoolBalances(poolId);
  const { group } = useGroupDetail(pool?.groupId ?? '');
  const { profile } = useProfile();
  const { deletePool, isDeleting } = useDeletePool(poolId, pool?.groupId ?? '');
  const { isLoading: isLoadingExpenses, pagination } = usePoolExpenses(poolId);

  const [showDeleteModal, setShowDeleteModal] = React.useState(false);

  const isAdmin =
    !!profile &&
    !!group?.members &&
    group.members.some((m) => m.userId === profile.id && m.role === 'admin');

  const handleConfirmDelete = async () => {
    await deletePool();
    setShowDeleteModal(false);
    if (canGoBack()) goBack();
  };

  if (isLoading) {
    return <ScreenLoader />;
  }

  if (!pool) {
    return (
      <ScreenContainer>
        <Text>Pool not found</Text>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer useScrollView={false}>
      <PoolHeader
        isAdmin={isAdmin}
        onDeletePress={() => setShowDeleteModal(true)}
        poolName={pool.name}
        groupName={group?.name as string}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: Platform.OS === 'ios' ? Spacing.xxl : 100,
          gap: Spacing.xxl,
        }}
      >
        <PoolBalances
          memberSummary={memberSummary}
          totalAmount={totalAmount}
          splitType={pool.splitType}
          totalExpenses={pagination?.total_items ?? 0}
          amountCollected={amountCollected}
          isLoading={isLoadingBalance || isLoadingExpenses}
        />
        <PoolMemberSummary memberSummary={memberSummary} isLoading={isLoadingBalance} />
        <PoolSettlement isLoading={isLoadingBalance} balances={balances} />
      </ScrollView>

      <ConfirmDeleteModal
        visible={showDeleteModal}
        icon="trash-outline"
        title="Delete pool?"
        message="If this pool has no expenses it will be permanently deleted. If it has expenses, it will be archived instead."
        isLoading={isDeleting}
        onCancel={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
      />
    </ScreenContainer>
  );
}

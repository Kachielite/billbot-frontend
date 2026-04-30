import { Platform, ScrollView } from 'react-native';
import React from 'react';
import type { StaticScreenProps } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import ScreenContainer from '@/core/common/components/layout/screen-container';
import useRefetchOnFocus from '@/core/common/hooks/use-refetch-on-focus';
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
import PoolExpenses from '@/features/pools/components/pool.expenses';
import EmptyState from '@/core/common/components/empty-state';

type Props = StaticScreenProps<{ poolId: string }>;

export default function PoolScreen({ route }: Props) {
  const { poolId } = route.params;
  const navigation = useNavigation() as any;
  const { canGoBack, goBack } = navigation;

  const { pool, isLoading, refetch: refetchPool } = usePoolDetail(poolId);
  const {
    isLoading: isLoadingBalance,
    memberSummary,
    totalAmount,
    amountCollected,
    balances,
    refetch: refetchBalances,
  } = usePoolBalances(poolId);
  const { group, refetch: refetchGroup } = useGroupDetail(pool?.groupId ?? '');
  const { profile } = useProfile();
  const { deletePool, isDeleting } = useDeletePool(poolId, pool?.groupId ?? '');
  const {
    isLoading: isLoadingExpenses,
    pagination,
    refetch: refetchExpenses,
  } = usePoolExpenses(poolId);

  useRefetchOnFocus([refetchPool, refetchBalances, refetchGroup, refetchExpenses]);

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
        <EmptyState
          title="Tab not found"
          subtitle="This tab may have been deleted or is unavailable."
        />
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
        poolId={poolId}
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
        <PoolSettlement
          isLoading={isLoadingBalance}
          balances={balances}
          onSettlePress={(toUserId, amount) =>
            navigation.navigate('RecordPayment', { poolId, toUserId, amount })
          }
          onViewSettlements={() => navigation.navigate('Settlements', { poolId })}
        />
        <PoolExpenses
          expenses={pagination?.items.slice(0, 6) ?? []}
          isLoading={isLoadingExpenses}
        />
      </ScrollView>

      <ConfirmDeleteModal
        visible={showDeleteModal}
        icon="trash-outline"
        title="Delete tab?"
        message="If this tab has no expenses it will be permanently deleted. If it has expenses, it will be archived instead."
        isLoading={isDeleting}
        onCancel={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
      />
    </ScreenContainer>
  );
}

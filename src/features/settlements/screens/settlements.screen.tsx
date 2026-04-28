import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import { StaticScreenProps, useNavigation } from '@react-navigation/native';
import ScreenContainer from '@/core/common/components/layout/screen-container';
import useThemeColors from '@/core/common/hooks/use-theme-colors';
import { Radius, Shadow, Spacing } from '@/core/common/constants/theme';
import { TextStyles } from '@/core/common/constants/fonts';
import { Ionicons } from '@expo/vector-icons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import usePoolSettlements from '@/features/settlements/hooks/use-pool-settlements';
import useConfirmSettlement from '@/features/settlements/hooks/use-confirm-settlement';
import usePoolDetail from '@/features/pools/hooks/use-pool-detail';
import useGroupDetail from '@/features/groups/hooks/use-group-detail';
import SettlementCard from '@/features/settlements/components/settlement-card';
import DisputeSettlementModal from '@/features/settlements/components/dispute-settlement-modal';
import EmptyState from '@/core/common/components/empty-state';
import { Settlement } from '@/features/settlements/settlements.interface';

type Props = StaticScreenProps<{ poolId: string }>;

export default function SettlementsScreen({ route }: Props) {
  const { poolId } = route.params;
  const colors = useThemeColors();
  const nav = useNavigation() as any;

  const { pool } = usePoolDetail(poolId);
  const { group } = useGroupDetail(pool?.groupId ?? '');
  const members = group?.members ?? [];

  const { settlements, isLoading, refetch } = usePoolSettlements(poolId);
  const { confirmSettlement, isConfirming } = useConfirmSettlement(poolId);

  const [disputeTarget, setDisputeTarget] = React.useState<Settlement | null>(null);

  return (
    <ScreenContainer useScrollView={false}>
      {/* ── Header ── */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            style={[styles.backBtn, { backgroundColor: colors.surface }]}
            onPress={() => {
              if (nav.canGoBack()) nav.goBack();
            }}
          >
            <FontAwesome6 name="chevron-left" size={16} color={colors.text.primary} />
          </TouchableOpacity>
          <View>
            <Text
              style={[
                TextStyles.bodySmall,
                { color: colors.text.secondary, textTransform: 'uppercase' },
              ]}
            >
              {pool?.name ?? ''}
            </Text>
            <Text style={[TextStyles.headingMedium, { color: colors.text.primary }]}>
              SETTLEMENTS
            </Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => nav.navigate('RecordPayment', { poolId })}
          style={[styles.newBtn, { backgroundColor: colors.primary }]}
        >
          <Ionicons name="add" size={20} color={colors.onPrimary} />
          <Text style={[TextStyles.label, { color: colors.onPrimary }]}>New</Text>
        </TouchableOpacity>
      </View>

      {/* ── List ── */}
      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={settlements}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          extraData={members}
          renderItem={({ item }) => (
            <SettlementCard
              settlement={item}
              members={members}
              onPress={() => nav.navigate('Settlement', { settlementId: item.id, poolId })}
              onConfirm={confirmSettlement}
              onDispute={(s) => setDisputeTarget(s)}
              isConfirming={isConfirming}
            />
          )}
          ListEmptyComponent={
            <EmptyState
              title="No settlements yet"
              subtitle="Record a payment to get started."
              actionLabel="Record payment"
              onAction={() => refetch()}
            />
          }
        />
      )}

      <DisputeSettlementModal
        visible={!!disputeTarget}
        onClose={() => setDisputeTarget(null)}
        settlement={disputeTarget}
        poolId={poolId}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  backBtn: {
    width: 45,
    height: 45,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadow.sm,
  },
  newBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.full,
    ...Shadow.sm,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContent: {
    gap: Spacing.sm,
    paddingVertical: Spacing.md,
    paddingBottom: Spacing.xl,
  },
});
